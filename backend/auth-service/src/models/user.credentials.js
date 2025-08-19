class UserCredentials {
  constructor(data) {
    this.credentials_id = data.credentials_id;
    this.user_id = data.user_id;
    this.email = data.email;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  toJSON() {
    return {
      credentials_id: this.credentials_id,
      user_id: this.user_id,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export default UserCredentials;
