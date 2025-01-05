import {EditableProps} from "@/defines/abilities/EditableProps.ts";
import {DerivableProps} from "@/defines/abilities/DerivableProps.ts";
import * as React from "react";
import {ReactNode} from "react";


/**
 * NestableProps
 * @date 2024-12-13
 * @param isEditable
 */
export interface NestableProps extends EditableProps, DerivableProps {
}


/**
 * setupChildren
 * Setup children with props.
 * @date 2024-12-13
 * @param children
 * @param props
 */
export function setupChildren(children: React.ReactNode, props: { [key: string]: any }): React.ReactNode {
  return React.Children.map(children, (child) => {
    // Return non-React elements
    if (typeof child !== 'object' || !React.isValidElement(child)) {
      return child;
    }
    // Iterate over the fragment's children
    if (React.isValidElement(child) && child.type === React.Fragment) {
      return React.Children.map(child.props.children, (grandchild) =>
        cloneElement(grandchild as React.ReactElement, props)
      );
    }
    // Return React elements
    return cloneElement(child as React.ReactElement, props);
  });
}

function cloneElement(child: React.ReactElement, props: { [key: string]: any }): ReactNode {
  return React.cloneElement(child, {
    ...props,
    ...child.props  // internal wired props will be overridden by specified ones
  });
}

export function addChild<T extends DerivableProps<T[]>>(data: T | null, path: number[], newChild: T): T {
  if (!data) {
    throw new Error('Data is null');
  }
  if (path.length === 0) {
    return {...data, children: [...data.children ?? [], newChild]};
  }
  const [current, ...rest] = path;
  return {
    ...data,
    children: data.children?.map((item, index) =>
      index === current
        ? addChild(item, rest, newChild)
        : item
    ),
  };
}

export function removeChild<T extends DerivableProps<T[]>>(data: T | null, path: number[]): T {
  if (!data) {
    throw new Error('Data is null');
  }
  if (path.length === 1) {
    return {
      ...data,
      children: data.children?.filter((_, index) => index !== path[0]),
    };
  }
  const [current, ...rest] = path;
  return {
    ...data,
    children: data.children?.map((item, index) =>
      index === current
        ? removeChild(item, rest)
        : item
    ),
  };
}