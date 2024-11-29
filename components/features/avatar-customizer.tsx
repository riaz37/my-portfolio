import { CldUploadWidget } from "next-cloudinary";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Loader2, RefreshCcw, Upload, Camera } from "lucide-react";
import { useCustomToast } from '@/components/shared/ui/toast/toast-wrapper'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/ui/data-display/avatar";
import { Button } from "@/components/shared/ui/core/button";
import { Card } from "@/components/shared/ui/data-display/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/core/select";

const STYLE_OPTIONS = [
  { value: "realistic", label: "Realistic" },
  { value: "anime", label: "Anime" },
  { value: "pixel", label: "Pixel Art" },
  { value: "3d", label: "3D" },
];

export default function AvatarCustomizer() {
  const { data: session, update } = useSession();
  const { toast } = useCustomToast();
  const [uploadedAvatar, setUploadedAvatar] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "generate">("upload");

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col items-center space-y-8">
        {/* Avatar Preview Section */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur"></div>
          <Avatar className="relative w-32 h-32 border-2 border-background">
            <AvatarImage
              src={uploadedAvatar || session?.user?.image || ""}
              alt="Avatar"
              className="object-cover"
            />
            <AvatarFallback className="text-3xl bg-muted">
              {session?.user?.name?.slice(0, 2).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <Button
            variant={activeTab === "upload" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("upload")}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Button
            variant={activeTab === "generate" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("generate")}
            className="flex-1"
          >
            <Camera className="w-4 h-4 mr-2" />
            Generate
          </Button>
        </div>

        {/* Content Section */}
        <div className="w-full space-y-6">
          {activeTab === "upload" ? (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="font-semibold tracking-tight">Upload Avatar</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a photo to set as your profile picture
                </p>
              </div>

              <CldUploadWidget
                uploadPreset="portfolio_avatars"
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                onUpload={(result: any) => {
                  if (result?.event === "success") {
                    const url = result.info.secure_url;
                    setUploadedAvatar(url);

                    fetch("/api/user/avatar", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ avatar: url }),
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        if (data.error) throw new Error(data.error);
                        toast({
                          title: "Avatar Updated",
                          description: "Your profile picture has been updated successfully!",
                        });
                        update();
                      })
                      .catch((error) => {
                        console.error("Error updating avatar:", error);
                        toast({
                          title: "Update Failed",
                          description: "Could not update your avatar. Please try again.",
                          variant: "destructive",
                        });
                      });
                  }
                }}
                onError={(error: any) => {
                  console.error("Upload error:", error);
                  toast({
                    title: "Upload Failed",
                    description: "Could not upload your image. Please try again.",
                    variant: "destructive",
                  });
                }}
                options={{
                  maxFiles: 1,
                  maxFileSize: 5000000,
                  resourceType: "image",
                  clientAllowedFormats: ["jpg", "png", "gif", "webp"],
                  cropping: true,
                  croppingAspectRatio: 1,
                  croppingShowDimensions: true,
                  croppingValidateDimensions: true,
                  croppingDefaultSelectionRatio: 1,
                  showAdvancedOptions: false,
                  multiple: false,
                  sources: ["local", "camera"],
                  showSkipCropButton: false,
                  styles: {
                    palette: {
                      window: "rgb(var(--background))",
                      sourceBg: "rgb(var(--background))",
                      windowBorder: "rgb(var(--border))",
                      tabIcon: "rgb(var(--primary))",
                      menuIcons: "rgb(var(--foreground))",
                      textDark: "rgb(var(--foreground))",
                      textLight: "#FFFFFF",
                      link: "rgb(var(--primary))",
                      action: "rgb(var(--primary))",
                      inactiveTabIcon: "rgb(var(--muted-foreground))",
                      error: "rgb(var(--destructive))",
                      inProgress: "rgb(var(--primary))",
                      complete: "rgb(var(--primary))",
                      borderRadius: "0.75rem"
                    },
                    frame: {
                      background: "transparent",
                    },
                    modal: {
                      background: "rgb(var(--background))",
                      border: "1px solid rgb(var(--border))",
                      borderRadius: "0.75rem",
                      padding: "1rem"
                    }
                  }
                }}
              >
                {({ open }: { open: () => void }) => (
                  <div className="space-y-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full relative overflow-hidden group"
                      onClick={() => open()}
                    >
                      <div className="absolute inset-0 w-3 bg-gradient-to-r from-pink-600 to-purple-600 transition-all duration-300 ease-out -translate-x-full group-hover:translate-x-full"></div>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Photo
                    </Button>
                    <div className="text-xs text-center space-y-1 text-muted-foreground">
                      <p>Supported: JPG, PNG, GIF, WebP</p>
                      <p>Max size: 5MB</p>
                    </div>
                  </div>
                )}
              </CldUploadWidget>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="font-semibold tracking-tight">Generate Avatar</h3>
                <p className="text-sm text-muted-foreground">
                  Create a unique AI-generated avatar
                </p>
              </div>

              <div className="space-y-4">
                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose style" />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLE_OPTIONS.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full relative overflow-hidden group"
                  onClick={() => {
                    setIsGenerating(true);
                    setTimeout(() => {
                      setIsGenerating(false);
                      toast({
                        title: "Coming Soon",
                        description: "AI avatar generation will be available soon!",
                      });
                    }, 1000);
                  }}
                  disabled={isGenerating}
                >
                  <div className="absolute inset-0 w-3 bg-gradient-to-r from-pink-600 to-purple-600 transition-all duration-300 ease-out -translate-x-full group-hover:translate-x-full"></div>
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCcw className="w-4 h-4 mr-2" />
                  )}
                  Generate Avatar
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Select a style and click generate to create your AI avatar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
