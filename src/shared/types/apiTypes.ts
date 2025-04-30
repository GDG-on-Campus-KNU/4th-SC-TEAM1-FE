export type StackTraceItem = {
  classLoaderName: string;
  moduleName: string;
  moduleVersion: string;
  methodName: string;
  fileName: string;
  lineNumber: number;
  className: string;
  nativeMethod: boolean;
};

export type SuppressedItem = {
  stackTrace: StackTraceItem[];
  message: string;
  localizedMessage: string;
};

export type Cause = {
  stackTrace: StackTraceItem[];
  message: string;
  localizedMessage: string;
};

export type ErrorData = {
  cause?: Cause;
  stackTrace?: StackTraceItem[];
  message?: string;
  suppressed?: SuppressedItem[];
  localizedMessage?: string;
};

export type ErrorResponse = {
  code: number;
  status: string;
  message: string;
  data: ErrorData;
};

export type LoginRequest = {
  userId: string;
  password: string;
};

export type LoginResponse = {
  code: number;
  status: string;
  message: string;
  data: {
    userId: string;
    nickname: string;
    accessToken: string;
    refreshToken: string;
  };
};

export type SignupRequest = {
  userId: string;
  password: string;
  passwordCheck: string;
  nickname: string;
};

export type SuccessResponse = {
  code: number;
  status: string;
  message: string;
  data: {
    userId: string;
  };
};
