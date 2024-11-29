#!/bin/bash

# Find and replace toast imports and usage
find /media/riaz37/WebDevelopment/portfolio-website -type f \( -name "*.tsx" -o -name "*.ts" \) -print0 | xargs -0 sed -i '
    s|import { useToast } from '"'"'@/components/shared/ui/feedback/use-toast'"'"';|import { useCustomToast } from '"'"'@/components/shared/ui/toast/toast-wrapper'"'"';|g;
    s|import { useToast } from '"'"'@/hooks/useToast'"'"';|import { useCustomToast } from '"'"'@/components/shared/ui/toast/toast-wrapper'"'"';|g;
    s|import { useToast } from '"'"'@/hooks/use-toast'"'"';|import { useCustomToast } from '"'"'@/components/shared/ui/toast/toast-wrapper'"'"';|g;
    s|const { toast } = useToast();|const { toast } = useCustomToast();|g;
    s|variant: "destructive"|variant: "error"|g
'

# Remove old toast-related files and directories
rm -rf /media/riaz37/WebDevelopment/portfolio-website/components/shared/ui/feedback
rm -rf /media/riaz37/WebDevelopment/portfolio-website/hooks/useToast.ts
rm -rf /media/riaz37/WebDevelopment/portfolio-website/hooks/use-toast.ts

echo "Toast migration completed successfully!"
