'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Globe,
  Code,
  Shield,
  Eye,
  EyeOff,
  Terminal,
  Save,
  Palette,
  Lock,
} from 'lucide-react';
import { Card } from '@/components/shared/ui/data-display/card';
import { Badge } from '@/components/shared/ui/data-display/badge';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/form/input';
import { Label } from '@/components/shared/ui/form/label';
import { Switch } from '@/components/shared/ui/core/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/navigation/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/core/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shared/ui/data-display/avatar';
import { AvatarSelector } from '@/components/shared/ui/data-display/avatar-selector';
import { Separator } from '@/components/shared/ui/core/separator';
import { useToast } from '@/components/shared/ui/feedback/use-toast';

const languages = [
  { name: 'English', value: 'en', flag: '🇺🇸' },
  { name: 'Spanish', value: 'es', flag: '🇪🇸' },
  { name: 'French', value: 'fr', flag: '🇫🇷' },
  { name: 'German', value: 'de', flag: '🇩🇪' },
  { name: 'Chinese', value: 'zh', flag: '🇨🇳' },
  { name: 'Japanese', value: 'ja', flag: '🇯🇵' },
];

const editorThemes = [
  { name: 'GitHub Dark', value: 'github-dark' },
  { name: 'GitHub Light', value: 'github-light' },
  { name: 'Monokai', value: 'monokai' },
  { name: 'Dracula', value: 'dracula' },
  { name: 'Nord', value: 'nord' },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    achievements: true,
    updates: true,
    newsletter: false,
    tips: true,
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    editorTheme: 'github-dark',
    autoSave: true,
    lineNumbers: true,
    minimap: true,
    wordWrap: true,
    formatOnSave: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      toast({
        title: 'Success',
        description: 'Your password has been updated successfully',
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Settings & Preferences
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Customize your playground experience and manage your account settings
        </p>
      </motion.div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="editor">
            <Code className="w-4 h-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <AvatarSelector
                currentAvatar="/avatars/avatar-1.png"
                onSelect={(url) => console.log('Avatar selected:', url)}
              />
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="johndoe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" defaultValue="Full-stack developer passionate about open source" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Connected Accounts</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" />
                  <div>
                    <p className="font-medium">GitHub</p>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Disconnect</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5" />
                  <div>
                    <p className="font-medium">CodeSandbox</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Password & Security</h3>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Update Password
              </Button>
            </form>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Language</h3>
            <Select
              value={preferences.language}
              onValueChange={(value) => setPreferences({ ...preferences, language: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(({ name, value, flag }) => (
                  <SelectItem key={value} value={value}>
                    <span className="flex items-center gap-2">
                      <span>{flag}</span>
                      <span>{name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        </TabsContent>

        {/* Editor Settings */}
        <TabsContent value="editor" className="mt-6 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Editor Theme</h3>
            <Select
              value={preferences.editorTheme}
              onValueChange={(value) => setPreferences({ ...preferences, editorTheme: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {editorThemes.map(({ name, value }) => (
                  <SelectItem key={value} value={value}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Save</Label>
                  <p className="text-sm text-muted-foreground">Automatically save changes</p>
                </div>
                <Switch
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, autoSave: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Line Numbers</Label>
                  <p className="text-sm text-muted-foreground">Show line numbers in editor</p>
                </div>
                <Switch
                  checked={preferences.lineNumbers}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, lineNumbers: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Minimap</Label>
                  <p className="text-sm text-muted-foreground">Show code minimap</p>
                </div>
                <Switch
                  checked={preferences.minimap}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, minimap: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Word Wrap</Label>
                  <p className="text-sm text-muted-foreground">Wrap long lines of code</p>
                </div>
                <Switch
                  checked={preferences.wordWrap}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, wordWrap: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Format on Save</Label>
                  <p className="text-sm text-muted-foreground">Format code when saving</p>
                </div>
                <Switch
                  checked={preferences.formatOnSave}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, formatOnSave: checked })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Achievements</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new achievements</p>
                </div>
                <Switch
                  checked={notifications.achievements}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, achievements: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive platform update notifications</p>
                </div>
                <Switch
                  checked={notifications.updates}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, updates: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Newsletter</Label>
                  <p className="text-sm text-muted-foreground">Subscribe to our newsletter</p>
                </div>
                <Switch
                  checked={notifications.newsletter}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, newsletter: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Tips & Tutorials</Label>
                  <p className="text-sm text-muted-foreground">Get coding tips and tutorials</p>
                </div>
                <Switch
                  checked={notifications.tips}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, tips: checked })
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mt-8"
      >
        <Button size="lg" className="gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
}
