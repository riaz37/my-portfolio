import { frontendPath } from './frontend-resources';
import { backendPath } from './backend-resources';
import { interviewPath } from './interview-resources';
import { CareerPath } from '@/types/learningPath';

export const careerPaths: CareerPath[] = [
  frontendPath,
  backendPath,
  interviewPath
];

export const getCareerPathById = (id: string): CareerPath | undefined => {
  return careerPaths.find(path => path.id === id);
};

export const getLearningPathById = (careerPathId: string, learningPathId: string) => {
  const careerPath = getCareerPathById(careerPathId);
  return careerPath?.learningPaths.find(path => path.id === learningPathId);
};

export const getSkillById = (
  careerPathId: string,
  learningPathId: string,
  skillId: string
) => {
  const learningPath = getLearningPathById(careerPathId, learningPathId);
  return learningPath?.skills.find(skill => skill.id === skillId);
};

export const getResourceById = (
  careerPathId: string,
  learningPathId: string,
  skillId: string,
  resourceId: string
) => {
  const skill = getSkillById(careerPathId, learningPathId, skillId);
  return skill?.resources.find(resource => resource.id === resourceId);
};

export const getNextAvailableSkill = (
  careerPathId: string,
  learningPathId: string,
  currentSkillId: string
) => {
  const learningPath = getLearningPathById(careerPathId, learningPathId);
  if (!learningPath) return undefined;

  const currentSkillIndex = learningPath.skills.findIndex(
    skill => skill.id === currentSkillId
  );

  if (currentSkillIndex === -1 || currentSkillIndex === learningPath.skills.length - 1) {
    return undefined;
  }

  return learningPath.skills[currentSkillIndex + 1];
};

export const getNextLearningPath = (careerPathId: string, currentLearningPathId: string) => {
  const careerPath = getCareerPathById(careerPathId);
  if (!careerPath) return undefined;

  const currentPathIndex = careerPath.learningPaths.findIndex(
    path => path.id === currentLearningPathId
  );

  if (currentPathIndex === -1 || currentPathIndex === careerPath.learningPaths.length - 1) {
    return undefined;
  }

  return careerPath.learningPaths[currentPathIndex + 1];
};

export const checkPrerequisites = (
  careerPathId: string,
  learningPathId: string,
  skillId: string,
  completedSkills: string[]
) => {
  const skill = getSkillById(careerPathId, learningPathId, skillId);
  if (!skill || !skill.prerequisites) return true;

  return skill.prerequisites.every(prereq => completedSkills.includes(prereq));
};

export const calculateProgress = (
  careerPathId: string,
  completedResources: { resourceId: string; skillId: string }[]
) => {
  const careerPath = getCareerPathById(careerPathId);
  if (!careerPath) return undefined;

  const totalResources = careerPath.learningPaths.reduce(
    (total, path) =>
      total +
      path.skills.reduce((skillTotal, skill) => skillTotal + skill.resources.length, 0),
    0
  );

  const completedCount = completedResources.length;
  const percentageComplete = (completedCount / totalResources) * 100;

  return {
    totalResources,
    completedResources: completedCount,
    percentageComplete: Math.round(percentageComplete),
  };
};
