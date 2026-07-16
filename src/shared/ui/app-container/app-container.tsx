import { Container, type ContainerProps } from '@mantine/core';
import type { ReactNode } from 'react';

const APP_CONTAINER_MAX_WIDTH = 1600;

type AppContainerProps = {
  children: ReactNode;
} & Pick<ContainerProps, 'px'>;

const AppContainer = ({ children, px = 'md' }: AppContainerProps) => {
  return (
    <Container size={APP_CONTAINER_MAX_WIDTH} px={px}>
      {children}
    </Container>
  );
};

export { APP_CONTAINER_MAX_WIDTH, AppContainer };
