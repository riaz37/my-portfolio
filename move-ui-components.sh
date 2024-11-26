#!/bin/bash

# Core UI components
mkdir -p components/shared/ui/core
mv components/shared/ui/button.tsx components/shared/ui/input.tsx components/shared/ui/textarea.tsx \
   components/shared/ui/select.tsx components/shared/ui/form.tsx components/shared/ui/label.tsx \
   components/shared/ui/core/

# Feedback components
mkdir -p components/shared/ui/feedback
mv components/shared/ui/alert.tsx components/shared/ui/toast.tsx components/shared/ui/loading.tsx \
   components/shared/ui/progress.tsx components/shared/ui/skeleton.tsx components/shared/ui/use-toast.ts \
   components/shared/ui/feedback/

# Navigation components
mkdir -p components/shared/ui/navigation
mv components/shared/ui/FloatingNavbar.tsx components/shared/ui/NavItems.tsx \
   components/shared/ui/tabs.tsx components/shared/ui/dropdown-menu.tsx \
   components/shared/ui/navigation/

# Data display components
mkdir -p components/shared/ui/data-display
mv components/shared/ui/card.tsx components/shared/ui/table.tsx components/shared/ui/badge.tsx \
   components/shared/ui/avatar.tsx components/shared/ui/verified-badge.tsx \
   components/shared/ui/empty-state.tsx components/shared/ui/data-display/

# Effects components
mkdir -p components/shared/ui/effects
mv components/shared/ui/animated-background.tsx components/shared/ui/background-beams.tsx \
   components/shared/ui/canvas-reveal-effect.tsx components/shared/ui/card-spotlight.tsx \
   components/shared/ui/dynamic-background.tsx components/shared/ui/grid-background.tsx \
   components/shared/ui/particles-background.tsx components/shared/ui/Spotlight.tsx \
   components/shared/ui/typewriter-effect.tsx components/shared/ui/BouncyText.tsx \
   components/shared/ui/Lamp.tsx components/shared/ui/effects/
