output "cloudfront_domain" {
  value = aws_cloudfront_distribution.marsha_cloudfront_distribution.domain_name
}

output "cloudfront_live_domain" {
  value = aws_cloudfront_distribution.marsha_cloudfront_live_distribution.domain_name
}

output "cloudfront_live_id" {
  value = aws_cloudfront_distribution.marsha_cloudfront_live_distribution.id
}

output "endpoint" {
  value = data.aws_lambda_invocation.configure_lambda_endpoint.result
}

output "presets" {
  value = data.aws_lambda_invocation.configure_lambda_presets.result
}

output "iam_trusted_signer_access_key_id" {
  value = aws_iam_access_key.marsha_access_key.id
}

output "iam_secret_access_key" {
  value = aws_iam_access_key.marsha_access_key.secret
}

output "medialive_role_arn" {
  value = aws_iam_role.medialive_access_role.arn
}
