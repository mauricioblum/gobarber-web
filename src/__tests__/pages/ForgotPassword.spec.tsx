import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';
import ForgotPassword from '../../pages/ForgotPassword';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();

const apiMock = new MockAdapter(api);

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

describe('ForgotPassword Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be able to send a forgot password request', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('Email');

    const buttonElement = getByText('Recuperar');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });

    fireEvent.click(buttonElement);

    apiMock
      .onPost('/password/forgot', { email: 'johndoe@example.com' })
      .replyOnce(204, {});

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should not be able to send a forgot password if email is invalid', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('Email');

    const buttonElement = getByText('Recuperar');

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).not.toHaveBeenCalled();
    });
  });

  it('should not be able to send a forgot password if api fails', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('Email');

    const buttonElement = getByText('Recuperar');

    fireEvent.change(emailField, {
      target: { value: 'johndoe@example.com' },
    });

    fireEvent.click(buttonElement);

    apiMock.onPost('/password/forgot').reply(500, () => {
      return new Error();
    });

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
