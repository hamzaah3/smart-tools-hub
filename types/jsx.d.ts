import type React from "react";

declare global {
  // Ensure JSX namespace exists for TypeScript when using the new JSX runtime.
  // This helps tools that still expect `JSX` to be defined.
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {}
    interface ElementAttributesProperty {
      props: {};
    }
    // Allow any intrinsic element; actual validation is handled by React/JSX runtime.
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};


