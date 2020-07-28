import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';
import ResetPassword from '../../pages/ResetPassword';

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
    useLocation: jest
      .fn()
      .mockReturnValueOnce({
        search: 'token?=123123123',
      })
      .mockReturnValue({ search: '' }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe('ResetPassword Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to reset password', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova Senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação de Senha',
    );
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '12345678' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '12345678' },
    });

    fireEvent.click(buttonElement);

    apiMock.onPost('/password/reset').reply(204, {});

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to reset password if passwords dont match', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova Senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação de Senha',
    );
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '12345678' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '1234' },
    });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display an Error if Reset fails', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova Senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação de Senha',
    );
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '12345678' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '12345678' },
    });

    fireEvent.click(buttonElement);

    apiMock.onPost('/password/reset').reply(500, () => {
      return new Error();
    });

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('should not be able to reset password if token is not present in URL', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova Senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação de Senha',
    );
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '12345678' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '12345678' },
    });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
