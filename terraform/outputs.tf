output "vpc_id" {
  description = "The ID of the OpsDesk VPC"
  value       = aws_vpc.opsdesk_vpc.id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "eks_cluster_name" {
  description = "Name of the EKS cluster"
  value       = aws_eks_cluster.opsdesk_eks.name
}

output "eks_cluster_endpoint" {
  description = "Kubernetes API server endpoint"
  value       = aws_eks_cluster.opsdesk_eks.endpoint
}

output "eks_cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = aws_eks_cluster.opsdesk_eks.certificate_authority[0].data
  sensitive   = true
}

output "kubectl_config_command" {
  description = "AWS CLI command to configure local kubeconfig for the cluster"
  value       = "aws eks --region ${var.aws_region} update-kubeconfig --name ${var.cluster_name}"
}
