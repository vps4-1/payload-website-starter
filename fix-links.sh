#!/bin/bash
FILES=(
  "src/app/(frontend)/posts/[slug]/page.tsx"
  "src/app/(frontend)/archives/page.tsx"
  "src/app/(frontend)/about/page.tsx"
  "src/app/(frontend)/tags/page.tsx"
  "src/app/(frontend)/search/page.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    sed -i '' 's/<a href="\(\/[^"]*\)" className="terminal-button"/<Link href="\1" className="terminal-button"/g' "$file"
    sed -i '' 's/<\/a>/<\/Link>/g' "$file"
    
    if ! grep -q "import Link from 'next/link'" "$file"; then
      sed -i '' "2i\\
import Link from 'next/link'\\
" "$file"
    fi
  fi
done
