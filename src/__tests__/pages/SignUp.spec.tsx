import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import SignUp from '../../pages/SignUp';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('../../services/api', () => {
  return {
    post: jest.fn(),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to sign up', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to sign up with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  // it('should display an Error if Sign Up fails', async () => {
  //   const { getByPlaceholderText, getByText } = render(<SignUp />);

  //   const emailField = getByPlaceholderText('Email');
  //   const passwordField = getByPlaceholderText('Senha');
  //   const buttonElement = getByText('Cadastrar');

  //   fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
  //   fireEvent.change(passwordField, { target: { value: '0' } });

  //   fireEvent.click(buttonElement);

  //   await wait(() => {
  //     expect(mockedAddToast).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         type: 'error',
  //       }),
  //     );
  //   });
  // });
});
