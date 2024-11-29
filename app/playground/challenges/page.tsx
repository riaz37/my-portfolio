"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/ui/core/button";
import { Badge } from '@/components/shared/ui/core/badge';
import { useCustomToast } from "@/components/shared/ui/toast/toast-wrapper";
import { motion } from "framer-motion";
import { Loading } from "@/components/shared/loading";
import { Card } from "@/components/shared/ui/core/card";
import { Input } from "@/components/shared/ui/core/input";
import { Search, Filter, Trophy, Code2, Brain, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/core/select";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  completed?: boolean;
}

export default function ChallengesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useCustomToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchChallenges();
    }
  }, [status, router]);

  useEffect(() => {
    filterChallenges();
  }, [searchQuery, selectedDifficulty, selectedStatus, challenges]);

  const fetchChallenges = async () => {
    try {
      const response = await fetch("/api/playground/challenges");
      if (!response.ok) throw new Error("Failed to fetch challenges");
      const data = await response.json();
      setChallenges(data);
      setFilteredChallenges(data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast({
        title: "Error",
        description: "Failed to load challenges",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterChallenges = () => {
    let filtered = [...challenges];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          challenge.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (challenge) => challenge.difficulty === selectedDifficulty
      );
    }

    // Apply completion status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((challenge) =>
        selectedStatus === "completed"
          ? challenge.completed
          : !challenge.completed
      );
    }

    setFilteredChallenges(filtered);
  };

  const handleChallengeClick = async (challengeId: string) => {
    router.push(`/playground/challenges/${challengeId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/10 text-green-500";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500";
      case "Hard":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getCompletedChallenges = () => {
    return challenges.filter((challenge) => challenge.completed).length;
  };

  if (status === "loading") {
    return <Loading text="Loading challenges..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background border-b border-border/40">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-4 -top-4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -right-4 -top-4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container relative mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/[0.05] border border-primary/10 mb-6">
                <div className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
                <span className="text-sm text-primary">Interactive Coding Challenges</span>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Master Your Skills with
              <br />
              <span className="relative">
                <span className="relative inline-block">
                  Coding Challenges
                  <motion.div
                    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </span>
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-muted-foreground text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Level up your coding skills with our curated collection of challenges
              designed to push your boundaries and expand your expertise.
            </motion.p>

            {/* Stats Cards with Enhanced Design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="transform transition-all duration-300"
              >
                <Card className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
                  <div className="p-6 text-center relative">
                    <div className="relative inline-block mb-3">
                      <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full" />
                      <Trophy className="w-8 h-8 text-yellow-500 relative" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{getCompletedChallenges()}</div>
                    <div className="text-sm text-muted-foreground">Challenges Completed</div>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="transform transition-all duration-300"
              >
                <Card className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                  <div className="p-6 text-center relative">
                    <div className="relative inline-block mb-3">
                      <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                      <Code2 className="w-8 h-8 text-blue-500 relative" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{challenges.length}</div>
                    <div className="text-sm text-muted-foreground">Total Challenges</div>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                className="transform transition-all duration-300"
              >
                <Card className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
                  <div className="p-6 text-center relative">
                    <div className="relative inline-block mb-3">
                      <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                      <Brain className="w-8 h-8 text-purple-500 relative" />
                    </div>
                    <div className="text-3xl font-bold mb-1">
                      {Math.round((getCompletedChallenges() / challenges.length) * 100 || 0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col md:flex-row gap-4 mb-12"
        >
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search challenges..."
              className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger className="w-[140px] bg-background/50 backdrop-blur-sm border-border/50">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-[140px] bg-background/50 backdrop-blur-sm border-border/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Challenge Cards */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="group relative h-full flex flex-col hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm bg-background/50 border-border/50"
                  onClick={() => handleChallengeClick(challenge.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {challenge.completed && (
                    <div className="absolute top-4 right-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500/20 blur-sm rounded-full" />
                        <Trophy className="w-5 h-5 text-yellow-500 relative" />
                      </div>
                    </div>
                  )}
                  <div className="p-6 relative">
                    <h2 className="text-xl font-semibold mb-3 pr-8 group-hover:text-primary transition-colors">
                      {challenge.title}
                    </h2>
                    <Badge
                      className={`${getDifficultyColor(
                        challenge.difficulty
                      )} mb-4`}
                    >
                      {challenge.difficulty}
                    </Badge>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {challenge.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {challenge.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-secondary/30 hover:bg-secondary/40 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto p-6 pt-4 relative">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-border/0 via-border/50 to-border/0" />
                    <Button
                      variant="default"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                    >
                      {challenge.completed ? "Review Challenge" : "Start Challenge"}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredChallenges.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-muted-foreground mb-6">
              No challenges found matching your criteria
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedDifficulty("all");
                setSelectedStatus("all");
              }}
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
