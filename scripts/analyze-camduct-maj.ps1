param(
  [Parameter(Mandatory=$true)]
  [string[]]$Path,
  [string]$OutDir = (Join-Path (Get-Location) "camduct-analysis"),
  [int]$Top = 300
)

$knownTokens = @(
  "./Fabrication/",
  "DW144-LV",
  "HVAC",
  "Burny",
  "GALV",
  "GALVANISED",
  "RND-SegmentBend.png",
  "RND-StraightSeamedPipe.png",
  "RECT-Spigot.png",
  "RECT-Radius Bend.png",
  "RECT-Taper.png",
  "RECT-SquaretoRoundOffset.png",
  "RECT-GrilleBoxCross.png",
  "Taper",
  "90 Radius Bend",
  "Spigot",
  "Spiral Tube",
  "Square Tee",
  "Воздуховод",
  "Канал",
  "Переход",
  "отвод 90"
)

function Resolve-InputFiles {
  param([string[]]$InputPath)
  $files = New-Object System.Collections.Generic.List[System.IO.FileInfo]
  foreach($entry in $InputPath){
    $resolved = Resolve-Path -LiteralPath $entry -ErrorAction SilentlyContinue
    if(-not $resolved){
      $wild = Resolve-Path -Path $entry -ErrorAction SilentlyContinue
      $resolved = $wild
    }
    foreach($item in $resolved){
      $info = Get-Item -LiteralPath $item.Path -ErrorAction SilentlyContinue
      if($null -eq $info){ continue }
      if($info.PSIsContainer){
        Get-ChildItem -LiteralPath $info.FullName -File -Recurse -Include *.MAJ,*.maj | ForEach-Object { $files.Add($_) }
      } else {
        $files.Add($info)
      }
    }
  }
  return $files | Sort-Object FullName -Unique
}

function Get-ReadableStrings {
  param([byte[]]$Bytes)
  $text = [System.Text.Encoding]::Unicode.GetString($Bytes)
  $pattern = "[A-Za-z0-9\p{IsCyrillic}_ ./\\:\-\+\(\),;]{3,}"
  [regex]::Matches($text,$pattern) |
    ForEach-Object { $_.Value.Trim() } |
    Where-Object { $_ -match "[A-Za-z0-9\p{IsCyrillic}]" -and $_.Length -ge 3 }
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$files = Resolve-InputFiles -InputPath $Path
if(-not $files){
  throw "No MAJ files found."
}

$index = @()
foreach($file in $files){
  $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
  $strings = Get-ReadableStrings -Bytes $bytes
  $counts = $strings |
    Group-Object |
    Sort-Object @{Expression="Count";Descending=$true}, Name |
    Select-Object -First $Top Count,Name
  $safeName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name) -replace "[^\p{L}\p{N}_\-.]+","_"
  $csvPath = Join-Path $OutDir "$safeName.strings.csv"
  $jsonPath = Join-Path $OutDir "$safeName.summary.json"
  $counts | Export-Csv -LiteralPath $csvPath -NoTypeInformation -Encoding UTF8
  $hits = foreach($token in $knownTokens){
    $count = ($strings | Where-Object { $_ -like "*$token*" }).Count
    if($count -gt 0){
      [pscustomobject]@{ token=$token; count=$count }
    }
  }
  $summary = [pscustomobject]@{
    file = $file.FullName
    length = $file.Length
    analyzedAt = (Get-Date).ToString("s")
    totalStrings = @($strings).Count
    topLimit = $Top
    knownTokenHits = @($hits)
    topStrings = @($counts | ForEach-Object { [pscustomobject]@{ count=$_.Count; value=$_.Name } })
  }
  $summary | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $jsonPath -Encoding UTF8
  $index += [pscustomobject]@{
    file = $file.FullName
    length = $file.Length
    totalStrings = @($strings).Count
    summary = $jsonPath
    stringsCsv = $csvPath
  }
}

$indexPath = Join-Path $OutDir "index.json"
$index | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $indexPath -Encoding UTF8
$index | Format-Table -AutoSize
Write-Host "Saved CAMduct analysis to $OutDir"
