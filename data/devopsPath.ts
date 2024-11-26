import { CareerPath, SkillLevel } from "@/types/learningPath";

export const devopsPath: CareerPath = {
  id: 'devops',
  title: 'DevOps Engineer',
  description: 'Learn to bridge development and operations with modern DevOps practices, tools, and cloud technologies.',
  icon: 'FaCloud',
  learningPaths: [
    {
      id: 'devops-fundamentals',
      title: 'DevOps Fundamentals',
      description: 'Learn the core concepts and tools of DevOps',
      icon: 'FaTools',
      estimatedTime: '2 months',
      difficulty: 'beginner',
      skills: [
        {
          id: 'linux',
          name: 'Linux Fundamentals',
          description: 'Master essential Linux commands and system administration',
          level: 'beginner' as SkillLevel,
          resources: [
            {
              id: 'linux-basics',
              title: 'Linux Command Line Basics',
              type: 'documentation',
              url: 'https://ubuntu.com/tutorials/command-line-for-beginners',
              description: 'Learn the basics of Linux command line'
            },
            {
              id: 'linux-admin',
              title: 'Linux System Administration',
              type: 'course',
              url: 'https://www.redhat.com/en/services/training/rh124-red-hat-system-administration-i',
              description: 'Comprehensive Linux system administration course'
            }
          ]
        },
        {
          id: 'git',
          name: 'Git & Version Control',
          description: 'Learn Git for version control and collaboration',
          level: 'beginner' as SkillLevel,
          resources: [
            {
              id: 'git-basics',
              title: 'Git Basics',
              type: 'documentation',
              url: 'https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control',
              description: 'Official Git documentation'
            },
            {
              id: 'git-branching',
              title: 'Learn Git Branching',
              type: 'practice',
              url: 'https://learngitbranching.js.org/',
              description: 'Interactive Git branching tutorial'
            }
          ]
        }
      ]
    },
    {
      id: 'containerization',
      title: 'Containerization & Orchestration',
      description: 'Master Docker and Kubernetes',
      icon: 'FaDocker',
      estimatedTime: '3 months',
      difficulty: 'intermediate',
      skills: [
        {
          id: 'docker',
          name: 'Docker',
          description: 'Learn container basics with Docker',
          level: 'intermediate' as SkillLevel,
          resources: [
            {
              id: 'docker-basics',
              title: 'Docker Getting Started',
              type: 'documentation',
              url: 'https://docs.docker.com/get-started/',
              description: 'Official Docker documentation'
            },
            {
              id: 'docker-practice',
              title: 'Docker Labs',
              type: 'practice',
              url: 'https://labs.play-with-docker.com/',
              description: 'Interactive Docker practice environment'
            }
          ]
        },
        {
          id: 'kubernetes',
          name: 'Kubernetes',
          description: 'Learn container orchestration with Kubernetes',
          level: 'intermediate' as SkillLevel,
          resources: [
            {
              id: 'k8s-basics',
              title: 'Kubernetes Basics',
              type: 'documentation',
              url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/',
              description: 'Official Kubernetes tutorial'
            },
            {
              id: 'k8s-practice',
              title: 'Katacoda Kubernetes',
              type: 'practice',
              url: 'https://www.katacoda.com/courses/kubernetes',
              description: 'Interactive Kubernetes scenarios'
            }
          ]
        }
      ]
    },
    {
      id: 'ci-cd',
      title: 'CI/CD & Automation',
      description: 'Learn continuous integration and deployment',
      icon: 'SiJenkins',
      estimatedTime: '2 months',
      difficulty: 'intermediate',
      skills: [
        {
          id: 'jenkins',
          name: 'Jenkins',
          description: 'Learn CI/CD with Jenkins',
          level: 'intermediate' as SkillLevel,
          resources: [
            {
              id: 'jenkins-basics',
              title: 'Jenkins Getting Started',
              type: 'documentation',
              url: 'https://www.jenkins.io/doc/tutorials/',
              description: 'Official Jenkins tutorials'
            },
            {
              id: 'jenkins-pipeline',
              title: 'Jenkins Pipeline',
              type: 'course',
              url: 'https://www.jenkins.io/doc/book/pipeline/',
              description: 'Learn Jenkins Pipeline syntax'
            }
          ]
        },
        {
          id: 'github-actions',
          name: 'GitHub Actions',
          description: 'Learn CI/CD with GitHub Actions',
          level: 'intermediate' as SkillLevel,
          resources: [
            {
              id: 'gh-actions-basics',
              title: 'GitHub Actions Quickstart',
              type: 'documentation',
              url: 'https://docs.github.com/en/actions/quickstart',
              description: 'Official GitHub Actions documentation'
            },
            {
              id: 'gh-actions-course',
              title: 'GitHub Actions Course',
              type: 'course',
              url: 'https://lab.github.com/githubtraining/github-actions:-hello-world',
              description: 'Interactive GitHub Actions course'
            }
          ]
        }
      ]
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure as Code',
      description: 'Master infrastructure automation',
      icon: 'SiTerraform',
      estimatedTime: '3 months',
      difficulty: 'advanced',
      skills: [
        {
          id: 'terraform',
          name: 'Terraform',
          description: 'Learn infrastructure as code with Terraform',
          level: 'advanced' as SkillLevel,
          resources: [
            {
              id: 'terraform-basics',
              title: 'Terraform Getting Started',
              type: 'documentation',
              url: 'https://learn.hashicorp.com/terraform',
              description: 'Official Terraform tutorials'
            },
            {
              id: 'terraform-practice',
              title: 'Terraform Practice',
              type: 'practice',
              url: 'https://learn.hashicorp.com/collections/terraform/aws-get-started',
              description: 'Hands-on Terraform with AWS'
            }
          ]
        },
        {
          id: 'ansible',
          name: 'Ansible',
          description: 'Learn configuration management with Ansible',
          level: 'advanced' as SkillLevel,
          resources: [
            {
              id: 'ansible-basics',
              title: 'Ansible Getting Started',
              type: 'documentation',
              url: 'https://docs.ansible.com/ansible/latest/getting_started/index.html',
              description: 'Official Ansible documentation'
            },
            {
              id: 'ansible-practice',
              title: 'Ansible Practice',
              type: 'practice',
              url: 'https://www.katacoda.com/courses/ansible/ansible-introduction',
              description: 'Interactive Ansible scenarios'
            }
          ]
        }
      ]
    }
  ]
};
