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
const path=require('path');
const vm=require('vm');
const files=['home.html','assets/atlas/atlas.html','modules/common/panel-module.js','modules/common/preview-axo.js','assets/atlas/catalog-map.js'];
for (const file of files) {
  const source=fs.readFileSync(file,'utf8');
  const scripts=file.endsWith('.html')
    ? [...source.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean)
    : [source];
  for (const code of scripts) new Function(code);
  console.log(file+' syntax ok');
}
function extractConst(source,name,nextName){
  const start=source.indexOf('const '+name+'=');
  if(start<0) throw new Error(name+' is missing in home.html');
  const after=start+('const '+name+'=').length;
  const end=nextName ? source.indexOf('\nconst '+nextName,after) : source.indexOf(';\n',after);
  if(end<0) throw new Error(name+' ending was not found in home.html');
  return Function('"use strict";return ('+source.slice(after,end).replace(/;\s*$/,'')+');')();
}
function extractRange(source,startNeedle,endNeedle,fileName){
  const start=source.indexOf(startNeedle);
  if(start<0) throw new Error(`${startNeedle} is missing in ${fileName}`);
  const end=source.indexOf(endNeedle,start);
  if(end<0) throw new Error(`${endNeedle} was not found in ${fileName}`);
  return source.slice(start,end);
}
function checkDictionaryParity(name,dict){
  const langs=['ru','uk','en'];
  const reference=new Set(Object.keys(dict.ru||{}));
  for (const lang of langs) {
    if (!dict[lang]) throw new Error(`${name}.${lang} is missing`);
    for (const key of reference) {
      if (!(key in dict[lang])) throw new Error(`${name}.${lang} is missing key ${key}`);
      if (dict[lang][key]===undefined || dict[lang][key]===null || String(dict[lang][key]).trim()==='') {
        throw new Error(`${name}.${lang}.${key} is empty`);
      }
    }
    for (const key of Object.keys(dict[lang])) {
      if (!reference.has(key)) throw new Error(`${name}.${lang} has extra key ${key}`);
    }
  }
}
const home=fs.readFileSync('home.html','utf8');
const panel=fs.readFileSync('modules/common/panel-module.js','utf8');
const uiText=extractConst(home,'UI_TEXT','PRODUCT_TEXT');
const productText=extractConst(home,'PRODUCT_TEXT','PRODUCT_ALIASES');
const materialText=extractConst(home,'MATERIAL_TEXT','PRODUCT_IMAGES');
const panelI18n=Function('"use strict";const lang="ru";'+extractRange(panel,'const i18n=','let UNIT','modules/common/panel-module.js')+';return i18n;')();
checkDictionaryParity('UI_TEXT',uiText);
checkDictionaryParity('panel i18n',panelI18n);
const catalogSandbox={window:{}};
vm.runInNewContext(fs.readFileSync('assets/atlas/catalog-map.js','utf8'),catalogSandbox,{filename:'catalog-map.js'});
const catalog=catalogSandbox.window.CALC_CATALOG||[];
const langs=['ru','uk','en'];
const catalogKeys=[];
const moduleKeys=new Set([...panel.matchAll(/"([^"]+)":\{category:/g)].map(m=>m[1]));
function checkAsset(ref,context){
  if (!ref) throw new Error(`${context} image is missing`);
  if (/^(https?:)?\/\//.test(ref) || ref.startsWith('data:')) throw new Error(`${context} uses a non-local image: ${ref}`);
  const resolved=path.resolve('assets/atlas',ref);
  if (!fs.existsSync(resolved)) throw new Error(`${context} image file is missing: ${ref}`);
}
for (const category of catalog) {
  for (const lang of langs) {
    if (!category.title?.[lang]) throw new Error(`Catalog category ${category.key} is missing ${lang} title`);
  }
  for (const item of category.items||[]) {
    catalogKeys.push(item.key);
    checkAsset(item.image,`Catalog item ${item.key}`);
    for (const lang of langs) {
      if (!item.title?.[lang]) throw new Error(`Catalog item ${item.key} is missing ${lang} title`);
    }
    for (const [index,variant] of (item.variants||[]).entries()) {
      checkAsset(variant.image,`Catalog item ${item.key} variant ${index+1}`);
      for (const lang of langs) {
        if (!variant.title?.[lang]) throw new Error(`Catalog item ${item.key} variant ${index+1} is missing ${lang} title`);
      }
    }
  }
}
for (const key of catalogKeys) {
  if (!moduleKeys.has(key)) throw new Error(`Calculator module is missing for catalog item ${key}`);
  if (!productText[key]) throw new Error(`PRODUCT_TEXT is missing catalog item ${key}`);
  for (const lang of langs) {
    if (!productText[key][lang]) throw new Error(`PRODUCT_TEXT.${key} is missing ${lang}`);
  }
}
for (const [key,labels] of Object.entries(materialText)) {
  for (const lang of langs) {
    if (!labels[lang]) throw new Error(`MATERIAL_TEXT.${key} is missing ${lang}`);
  }
}
console.log('catalog localization ok');
console.log('ui localization ok');
console.log('catalog assets ok');
console.log('catalog modules ok');
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
