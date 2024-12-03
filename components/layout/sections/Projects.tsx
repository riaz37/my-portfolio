"use client";

import { useMemo } from "react";
import ProjectCard from "@/components/layout/ProjectCard";
import { sectionTitles } from "@/lib/config/section-titles";
import { SectionTitle } from "@/components/shared/ui/section";
import { useToast } from "@/components/shared/ui/toast";
import { Loading } from "@/components/shared/loading";
import useSWR from "swr";

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  imageUrl: string;
}

const fetcher = async (url: string) => {
  try {
    console.group("🚀 Projects Fetcher Debug");
    console.log("🌐 Fetching URL:", url);
    console.log("🕒 Timestamp:", new Date().toISOString());

    const fullUrl = `${window.location.origin}${url}`;
    console.log("📍 Full URL:", fullUrl);

    const res = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });

    console.log("📡 Fetch Response Status:", res.status);
    console.log(
      "📋 Response Headers:",
      Object.fromEntries(res.headers.entries())
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Projects Fetch Error:", {
        status: res.status,
        statusText: res.statusText,
        errorText,
      });
      throw new Error(`Failed to fetch projects: ${errorText}`);
    }

    const data = await res.json();

    console.log("📦 Raw Data:", data);
    console.log("🔢 Total Projects:", data.length);
    console.log(
      "⭐ Featured Projects:",
      data.filter((p: Project) => p.featured)
    );
    console.groupEnd();

    return data;
  } catch (error) {
    console.error("🚨 Fetch Projects Error:", error);
    throw error;
  }
};

export function Projects() {
  const { toast } = useToast();
  const { data, error, isLoading } = useSWR<Project[]>(
    "/api/projects",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 3600000, // 1 hour
      fallbackData: [], // Provide an empty array as fallback
      onError: (err) => {
        console.error("SWR Projects Error:", err);
        toast({
          title: "Error",
          description: "Failed to fetch projects. Please try again later.",
          variant: "error",
        });
      },
    }
  );

  const projectsToShow = useMemo(() => {
    if (!data) return [];
    const featured = data.filter((project) => project.featured);
    return featured.length > 0 ? featured : data;
  }, [data]);

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            highlight="Featured Projects"
            badge="Projects"
            subtitle="A showcase of my best work, personal projects, and innovative solutions."
            showDecoration={true}
            className="mb-12"
            align="center"
          >
            Featured Projects
          </SectionTitle>
        </div>
        <div className="flex justify-center items-center min-h-[300px]">
          <Loading />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            highlight="Featured Projects"
            badge="Projects"
            subtitle="A showcase of my best work, personal projects, and innovative solutions."
            showDecoration={true}
            className="mb-12"
            align="center"
          >
            Featured Projects
          </SectionTitle>
        </div>
        <div className="text-center text-red-500 min-h-[300px] flex flex-col justify-center items-center">
          <p>Failed to load projects</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          highlight="Featured Projects"
          badge="Projects"
          subtitle="A showcase of my best work, personal projects, and innovative solutions."
          showDecoration={true}
          className="mb-12"
          align="center"
        >
          Featured Projects
        </SectionTitle>

        {!projectsToShow || projectsToShow.length === 0 ? (
          <div className="text-center text-muted-foreground min-h-[300px] flex flex-col justify-center items-center">
            <p>No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsToShow.map((project) => (
              <ProjectCard
                key={project._id}
                id={project._id}
                title={project.title}
                description={project.description}
                technologies={project.technologies}
                demo={project.liveUrl}
                github={project.githubUrl}
                image={project.imageUrl}
                isHovered={false}
                liveUrl={project.liveUrl}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
