class Address {
  constructor(data) {
    this.address_id = data.address_id;
    this.user_id = data.user_id;
    this.address_line1 = data.address_line1;
    this.address_line2 = data.address_line2;
    this.city = data.city;
    this.state = data.state;
    this.postal_code = data.postal_code;
    this.country = data.country;
    this.is_primary = data.is_primary;
    this.created_at = data.created_at;
  }

  toJSON() {
    return {
      address_id: this.address_id,
      user_id: this.user_id,
      address_line1: this.address_line1,
      address_line2: this.address_line2,
      city: this.city,
      state: this.state,
      postal_code: this.postal_code,
      country: this.country,
      is_primary: this.is_primary,
      created_at: this.created_at,
    };
  }
}

export default Address;
