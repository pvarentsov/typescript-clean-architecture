import { UserRole } from '@core/common/enums/UserEnums';
import { CreateUserEntityPayload } from '@core/domain/user/entity/type/CreateUserEntityPayload';
import { User } from '@core/domain/user/entity/User';
import { v4 } from 'uuid';

describe('User', () => {
  
  describe('new', () => {
    
    test('When input optional args are empty, expect it creates User instance with default parameters', async () => {
      const currentDate: number = Date.now();
      
      const createUserEntityPayload: CreateUserEntityPayload = {
        firstName: 'FirstName',
        lastName : 'LastName',
        email    : 'admin@email.com',
        role     : UserRole.ADMIN,
        password : v4()
      };
      
      const user: User = await User.new(createUserEntityPayload);
      
      expect(typeof user.getId() === 'string').toBeTruthy();
      expect(user.getFirstName()).toBe(createUserEntityPayload.firstName);
      expect(user.getLastName()).toBe(createUserEntityPayload.lastName);
      expect(user.getName()).toBe(`${createUserEntityPayload.firstName} ${createUserEntityPayload.lastName}`);
      expect(user.getEmail()).toBe(createUserEntityPayload.email);
      expect(user.getRole()).toBe(createUserEntityPayload.role);
      expect(user.getPassword()).not.toBe(createUserEntityPayload.password);
      expect(user.getCreatedAt().getTime()).toBeGreaterThanOrEqual(currentDate - 5000);
      expect(user.getEditedAt()).toBeNull();
      expect(user.getRemovedAt()).toBeNull();
    });
  
    test('When input optional args are set, expect it creates User instance with custom parameters', async () => {
      const customId: string = v4();
      const customCreatedAt: Date = new Date(Date.now() - 3000);
      const customEditedAt: Date = new Date(Date.now() - 2000);
      const customRemovedAt: Date = new Date(Date.now() - 1000);
      
      const createUserEntityPayload: CreateUserEntityPayload = {
        firstName: 'FirstName',
        lastName : 'LastName',
        email    : 'admin@email.com',
        role     : UserRole.ADMIN,
        password : v4(),
        id       : customId,
        createdAt: customCreatedAt,
        editedAt : customEditedAt,
        removedAt: customRemovedAt
      };
    
      const user: User = await User.new(createUserEntityPayload);
      
      expect(user.getId()).toBe(customId);
      expect(user.getFirstName()).toBe(createUserEntityPayload.firstName);
      expect(user.getLastName()).toBe(createUserEntityPayload.lastName);
      expect(user.getName()).toBe(`${createUserEntityPayload.firstName} ${createUserEntityPayload.lastName}`);
      expect(user.getEmail()).toBe(createUserEntityPayload.email);
      expect(user.getRole()).toBe(createUserEntityPayload.role);
      expect(user.getPassword()).not.toBe(createUserEntityPayload.password);
      expect(user.getCreatedAt()).toBe(customCreatedAt);
      expect(user.getEditedAt()).toBe(customEditedAt);
      expect(user.getRemovedAt()).toBe(customRemovedAt);
    });
    
  });
  
  describe('edit', () => {
    
    test('When input args are empty, expect it doesn\'t edit User instance', async () => {
      const user: User = await User.new({
        firstName: 'FirstName',
        lastName : 'LastName',
        email    : 'author@email.com',
        role     : UserRole.AUTHOR,
        password : v4()
      });
  
      await user.edit({});
      
      expect(user.getFirstName()).toBe('FirstName');
      expect(user.getLastName()).toBe('LastName');
      expect(user.getEditedAt()).toBeNull();
    });
  
    test('When input args are set, expect it edits User instance', async () => {
      const currentDate: number = Date.now();
  
      const user: User = await User.new({
        firstName: 'First Name',
        lastName : 'Last Name',
        email    : 'guest@email.com',
        role     : UserRole.GUEST,
        password : v4()
      });
    
      await user.edit({firstName: 'New First Name', lastName: 'New Last Name'});
  
      expect(user.getFirstName()).toBe('New First Name');
      expect(user.getLastName()).toBe('New Last Name');
      expect(user.getEditedAt()!.getTime()).toBeGreaterThanOrEqual(currentDate - 5000);
    });
    
  });
  
  describe('remove', () => {
    
    test('Expect it marks User instance as removed', async () => {
      const currentDate: number = Date.now();
  
      const user: User = await User.new({
        firstName: 'First Name',
        lastName : 'Last Name',
        email    : 'guest@email.com',
        role     : UserRole.GUEST,
        password : v4()
      });
      
      await user.remove();
      
      expect(user.getRemovedAt()!.getTime()).toBeGreaterThanOrEqual(currentDate - 5000);
    });
    
  });
  
  describe('comparePassword', () => {
    
    test('When password is correct, expect it returns TRUE', async () => {
      const password: string = v4();
      
      const user: User = await User.new({
        firstName: v4(),
        lastName : v4(),
        email    : 'guest@email.com',
        role     : UserRole.GUEST,
        password : password
      });
      
      await expect(user.comparePassword(password)).resolves.toBeTruthy();
    });
  
    test('When password is not correct, expect it returns FALSE', async () => {
      const password: string = v4();
      const incorrectPassword: string = password + v4();
    
      const user: User = await User.new({
        firstName: v4(),
        lastName : v4(),
        email    : 'author@email.com',
        role     : UserRole.AUTHOR,
        password : password
      });
      
      await expect(user.comparePassword(incorrectPassword)).resolves.toBeFalsy();
    });
    
  });
  
});
