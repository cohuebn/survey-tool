import { ReactNode, createContext, useState } from "react";

type NavbarContextProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const NavbarContext = createContext<NavbarContextProps>({
  open: false,
  setOpen: () => {},
});

type NavbarContextProviderProps = {
  children: ReactNode;
};

export const NavbarContextProvider = ({
  children,
}: NavbarContextProviderProps) => {
  const [open, setOpen] = useState(false);

  return (
    <NavbarContext.Provider value={{ open, setOpen }}>
      {children}
    </NavbarContext.Provider>
  );
};
