class User {
  constructor(data) {
    this.user_id = data.user_id;
    this.email = data.email;
    this.name = data.name;
    this.created_at = data.created_at;
    this.is_verified = data.is_verified;
  }

  toJSON() {
    return {
      user_id: this.user_id,
      email: this.email,
      name: this.name,
      created_at: this.created_at,
      is_verified: this.is_verified,
    };
  }
}

export default User;
