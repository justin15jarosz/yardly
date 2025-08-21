class Address {
  constructor(data) {
    this.address_id = data.address_id;
    this.street = data.street;
    this.city = data.city;
    this.state = data.state;
    this.zip = data.zip;
    this.created_at = data.created_at;
  }

  toJSON() {
    return {
      address_id: this.user_id,
      street: this.street,
      city: this.city,
      state: this.state,
      zip: this.zip,
      created_at: this.created_at,
    };
  }
}

export default Address;
