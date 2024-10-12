class ApiResponse{
  constructor(
    message = "Success",
    statusCode,
    data
  ){
    this.message = message
    this.success = true
    this.statusCode = statusCode < 400
    this.data = data
  }
}