// const { client } = require('../client')
import { client } from '../client';
const bcrypt = require('bcrypt');

// interface
interface User {
  username: string;
  password?: string;
  email: string;
  avatar: string;
  userID: number;
}

// create users
const createUser = async ({ username, password, email, avatar }: User) => {
  try {
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    const { rows: user } = await client.query(
      `
    INSERT INTO users(username, password, email, avatar)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, email, avatar
    `,
      [username, hashedPassword, email, avatar]
    );

    return user;
  } catch (error) {
    console.error('error creating user DB', error);
  }
};

// get user by username
const getUserByUsername = async (username: string) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT id, username, password, email, avatar FROM users
    WHERE username = $1
    `,
      [username]
    );

    return user;
  } catch (error) {
    console.error('Error retrieving user from DB', error);
  }
};

// get single user *authentication
const getUser = async ({ username, password }: User) => {
  try {
    const user: User = await getUserByUsername(username);
    const hashedPassword = user.password;
    const isValid: boolean = await bcrypt.compare(password, hashedPassword);

    if (isValid) {
      delete user.password;
      return user;
    } else {
      throw new Error('Invalid username or password');
    }
  } catch (error) {
    console.error('Error retrieving single user from DB', error);
  }
};

// get user by id
const getUserById = async (userID: User) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT id, username, email, avatar FROM users
    WHERE id = $1    
    `,
      [userID]
    );

    return user;
  } catch (error) {
    console.error('Error retrieving User by ID from DB', error);
  }
};

// get all users
const getAllUsers = async () => {
  try {
    const { rows: users } = await client.query(`
    SELECT id, username, avatar, email, is_active FROM users
    `);

    return users;
  } catch (error) {
    console.error('Error retreiving all users from DB', error);
  }
};

// edit user
const updateUser = async (userID: User, fields: User) => {
  try {
    const SALT_COUNT = 10;
    const password = fields.password;

    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    fields.password = hashedPassword;

    const setString = Object.keys(fields)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(', ');

    const {
      rows: [user],
    } = await client.query(
      `
    UPDATE users
    SET ${setString}
    WHERE id = ${userID}
    RETURNING *
    `,
      Object.values(fields)
    );

    delete user.password;

    return user;
  } catch (error) {
    console.error('Error updating user in DB', error);
  }
};

// delete user
const deleteUser = async (userID: User) => {
  try {
    const { rows: user } = await client.query(
      `
    UPDATE users
    SET "is_active" = false
    WHERE id = $1
    RETURNING username
    `,
      [userID]
    );

    return user;
  } catch (error) {
    console.error('Error setting user inactive from DB', error);
  }
};

// activate user
const activateUser = async (userID: User) => {
  const { rows: user } = await client.query(
    `
  UPDATE users
  SET "is_active" = true
  WHERE id = $1
  RETURNING username
  `,
    [userID]
  );

  return user;
};

module.exports = {
  createUser,
  getUserByUsername,
  getUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  activateUser,
};
