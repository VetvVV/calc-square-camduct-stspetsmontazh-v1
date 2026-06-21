param(
    [Parameter(Mandatory = $true)]
    [string]$BuildLabel,

    [Parameter(Mandatory = $true)]
    [string]$OutputPath
)

$ErrorActionPreference = 'Stop'

$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
Push-Location $Root
try {
    $Status = git status --short
} finally {
    Pop-Location
}

$Files = @()
foreach ($Line in $Status) {
    if ([string]::IsNullOrWhiteSpace($Line)) { continue }
    $Path = if ($Line.Length -gt 3) { $Line.Substring(3).Trim() } else { $Line.Trim() }
    if ($Path -match ' -> ') { $Path = ($Path -split ' -> ')[-1].Trim() }
    $Files += $Path
}

$Parts = New-Object System.Collections.Generic.List[string]
$Bullets = New-Object System.Collections.Generic.List[string]

function Has-File([string]$Pattern) {
    return [bool]($Files | Where-Object { $_ -match $Pattern } | Select-Object -First 1)
}

if (Has-File '(^|/)publish\.bat$|(^|/)scripts/') {
    $Parts.Add('publication flow') | Out-Null
    $Bullets.Add('Update PublishBot checks and publication scripts.') | Out-Null
}

if (Has-File '(^|/)VERSION\.txt$|(^|/)home\.html$') {
    $Parts.Add('build marker') | Out-Null
    $Bullets.Add("Update build marker to $BuildLabel.") | Out-Null
}

if (Has-File '(^|/)assets/atlas/|(^|/)assets\\atlas\\') {
    $Parts.Add('atlas') | Out-Null
    $Bullets.Add('Update atlas catalog behavior or assets.') | Out-Null
}

if (Has-File '(^|/)modules/|(^|/)modules\\') {
    $Parts.Add('calculators') | Out-Null
    $Bullets.Add('Update calculator modules or shared calculator panel.') | Out-Null
}

if (Has-File '(^|/)assets/fonts/|(^|/)assets\\fonts\\') {
    $Parts.Add('fonts') | Out-Null
    $Bullets.Add('Update local font assets.') | Out-Null
}

if (Has-File '(^|/)README\.md$|(^|/)PUBLISH_CHECKLIST\.md$|(^|/)docs/') {
    $Parts.Add('docs') | Out-Null
    $Bullets.Add('Update project documentation.') | Out-Null
}

if ($Parts.Count -eq 0) {
    $Parts.Add('Calc Square') | Out-Null
}

if ($Bullets.Count -eq 0) {
    $Bullets.Add('Publish current Calc Square changes.') | Out-Null
}

$Subject = 'Publish ' + (($Parts | Select-Object -Unique) -join ', ') + ' - ' + $BuildLabel
$ChangedFiles = $Files | Sort-Object -Unique | ForEach-Object { '- ' + $_ }

$Message = @(
    $Subject,
    '',
    'Changes:',
    ($Bullets | Select-Object -Unique | ForEach-Object { '- ' + $_ }),
    '',
    'Files:',
    $ChangedFiles
) | ForEach-Object { $_ }

$ResolvedOutputPath = if ([System.IO.Path]::IsPathRooted($OutputPath)) {
    $OutputPath
} else {
    Join-Path $Root $OutputPath
}

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllLines($ResolvedOutputPath, $Message, $Utf8NoBom)
Write-Output $Subject
