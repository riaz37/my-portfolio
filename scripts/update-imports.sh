#!/bin/bash

# Update button imports
find . -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/components/shared/ui/core/button|@/components/ui/buttons/gradient-button|g'

# Update card imports
find . -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/components/shared/ui/core/card|@/components/shared/ui/card|g'
find . -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/components/shared/ui/data-display/card|@/components/shared/ui/card|g'
find . -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/components/ui/card|@/components/shared/ui/card|g'
