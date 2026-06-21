$ErrorActionPreference = 'Stop'

$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
$HomePath = Join-Path $Root 'home.html'
$AtlasPath = Join-Path $Root 'assets\atlas\atlas.html'
$CatalogPath = Join-Path $Root 'assets\atlas\catalog-map.js'
$PreviewPath = Join-Path $Root 'modules\common\preview-axo.js'
$PanelPath = Join-Path $Root 'modules\common\panel-module.js'
$CalculatorPath = Join-Path $Root 'modules\common\calculator.html'
$VersionPath = Join-Path $Root 'VERSION.txt'

$Errors = New-Object System.Collections.Generic.List[string]
$Warnings = New-Object System.Collections.Generic.List[string]

function Add-Error([string]$Message) { $Errors.Add($Message) | Out-Null }
function Add-Warning([string]$Message) { $Warnings.Add($Message) | Out-Null }
function Read-Text([string]$Path) { [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8) }

Write-Host 'Running publication checks...'

$RequiredFiles = @(
    $HomePath,
    $AtlasPath,
    $CatalogPath,
    $PreviewPath,
    $PanelPath,
    $CalculatorPath,
    $VersionPath,
    (Join-Path $Root 'scripts\make-commit-message.ps1'),
    (Join-Path $Root 'assets\fonts\exo2.css')
)

foreach ($Path in $RequiredFiles) {
    if (-not (Test-Path $Path)) {
        Add-Error "Required file is missing: $Path"
    }
}

if ($Errors.Count -eq 0) {
    $HomeText = Read-Text $HomePath
    $AtlasText = Read-Text $AtlasPath
    $CalculatorText = Read-Text $CalculatorPath
    $VersionText = (Read-Text $VersionPath).Trim()

    if ($HomeText -notmatch '<div class="build-marker" hidden data-cache="build-\d{4}-\d{2}-\d{2}-\d{6}">build \d{4}-\d{2}-\d{2}-\d{4}</div>') {
        Add-Error 'home.html build marker is missing or has an invalid format.'
    }

    if ($VersionText -notmatch '^build \d{4}-\d{2}-\d{2}-\d{4}$') {
        Add-Error 'VERSION.txt has an invalid build format.'
    } elseif ($HomeText -notmatch [regex]::Escape(">$VersionText<")) {
        Add-Error 'VERSION.txt and home.html build marker are out of sync.'
    }

    if ($HomeText -notmatch 'function buildVersion\(\)' -or $HomeText -notmatch 'dataset\.cache') {
        Add-Error 'home.html does not use the cache build id for atlas/catalog cache busting.'
    }

    if ($HomeText -notmatch 'next\.searchParams\.set\("label",buildLabel\(\)\)') {
        Add-Error 'home.html does not pass a visible build label into the atlas.'
    }

    if ($AtlasText -notmatch 'params\.get\("label"\)\|\|params\.get\("v"\)') {
        Add-Error 'assets/atlas/atlas.html does not display the visible build label.'
    }

    if ($CalculatorText -notmatch 'preview-axo\.js') {
        Add-Error 'modules/common/calculator.html does not include preview-axo.js.'
    }

    $ForbiddenPatterns = @(
        'fonts\.googleapis\.com',
        'fonts\.gstatic\.com',
        'cdnjs\.cloudflare\.com',
        'cdn\.jsdelivr\.net',
        '@fontsource',
        '@import\s+url\(',
        '<script\s+src="https?://'
    )
    $ScanFiles = Get-ChildItem -Path $Root -Recurse -Include *.html,*.js,*.css -File |
        Where-Object { $_.FullName -notmatch '\\.git\\' }

    foreach ($File in $ScanFiles) {
        $Text = Read-Text $File.FullName
        foreach ($Pattern in $ForbiddenPatterns) {
            if ($Text -match $Pattern) {
                Add-Error "Forbidden external dependency in $($File.FullName): $Pattern"
            }
        }
        if ($Text -match '(?m)^(<<<<<<<|=======|>>>>>>>)') {
            Add-Error "Merge conflict marker found in $($File.FullName)"
        }
    }

    $Node = Get-Command node -ErrorAction SilentlyContinue
    if (-not $Node) {
        $BundledNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
        if (Test-Path $BundledNode) {
            $Node = Get-Item $BundledNode
        }
    }

    if ($Node) {
        $SyntaxCheck = @'
const fs=require('fs');
const files=['home.html','assets/atlas/atlas.html','modules/common/panel-module.js','modules/common/preview-axo.js','assets/atlas/catalog-map.js'];
for (const file of files) {
  const source=fs.readFileSync(file,'utf8');
  const scripts=file.endsWith('.html')
    ? [...source.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean)
    : [source];
  for (const code of scripts) new Function(code);
  console.log(file+' syntax ok');
}
'@
        $TempScript = Join-Path $env:TEMP 'calc-square-validate-syntax.js'
        [System.IO.File]::WriteAllText($TempScript, $SyntaxCheck, [System.Text.UTF8Encoding]::new($false))
        Push-Location $Root
        try {
            $NodePath = if ($Node.Source) { $Node.Source } else { $Node.FullName }
            & $NodePath $TempScript
            if ($LASTEXITCODE -ne 0) {
                Add-Error 'JavaScript syntax check failed.'
            }
        } finally {
            Pop-Location
            Remove-Item -LiteralPath $TempScript -ErrorAction SilentlyContinue
        }
    } else {
        Add-Warning 'Node.js was not found; JavaScript syntax check was skipped.'
    }
}

foreach ($Warning in $Warnings) {
    Write-Host "WARNING: $Warning" -ForegroundColor Yellow
}

if ($Errors.Count -gt 0) {
    Write-Host ''
    Write-Host 'Publication checks failed:' -ForegroundColor Red
    foreach ($ErrorItem in $Errors) {
        Write-Host " - $ErrorItem" -ForegroundColor Red
    }
    exit 1
}

Write-Host 'Publication checks passed.'
