import { Component, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[App ErrorBoundary]', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>예상치 못한 오류가 발생했어요 😥</div>;
    }

    return this.props.children;
  }
}
