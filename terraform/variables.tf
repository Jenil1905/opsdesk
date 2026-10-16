variable "aws_region" {
  description = "AWS region for provisioning EKS infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "production"
}

variable "cluster_name" {
  description = "Name of the AWS EKS Kubernetes cluster"
  type        = string
  default     = "opsdesk-eks-prod"
}

variable "vpc_cidr" {
  description = "CIDR block for the OpsDesk VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "CIDR blocks for public subnets (minimum 2 across distinct AZs)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets" {
  description = "CIDR blocks for private subnets (worker nodes & data layer)"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "node_instance_types" {
  description = "EC2 instance types for EKS managed worker nodes"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "desired_nodes" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 2
}

variable "min_nodes" {
  description = "Minimum number of worker nodes for auto-scaling"
  type        = number
  default     = 2
}

variable "max_nodes" {
  description = "Maximum number of worker nodes for auto-scaling"
  type        = number
  default     = 4
}
