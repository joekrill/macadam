import * as chakra from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../../test-utils";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

const mockToggleColorMode = jest.fn();

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useColorMode: jest.fn(),
  useColorModeValue: jest.fn(),
}));

let useColorModeSpy: jest.SpyInstance;
let useColorModeValueSpy: jest.SpyInstance;

beforeEach(() => {
  mockToggleColorMode.mockReset();
  useColorModeSpy = jest
    .spyOn(chakra, "useColorMode")
    .mockImplementation(() => ({
      toggleColorMode: mockToggleColorMode,
      colorMode: "dark",
      setColorMode: jest.fn(),
    }));

  useColorModeValueSpy = jest
    .spyOn(chakra, "useColorModeValue")
    .mockImplementation((_light, dark) => dark);
});

afterEach(() => {
  useColorModeValueSpy.mockRestore();
  useColorModeSpy.mockRestore();
});

test("renders the expected aria label when in dark mode", () => {
  useColorModeValueSpy.mockImplementation((_light, dark) => dark);
  render(<ColorModeSwitcher />);
  const button = screen.getByRole("button");
  expect(button.getAttribute("aria-label")).toContain("light");
});

test("renders the expected aria label when in light mode", () => {
  useColorModeValueSpy.mockImplementation((light, _dark) => light);
  render(<ColorModeSwitcher />);
  const button = screen.getByRole("button");
  expect(button.getAttribute("aria-label")).toContain("dark");
});

test("toggles color mode when clicked", () => {
  render(<ColorModeSwitcher />);
  const button = screen.getByRole("button");
  userEvent.click(button);
  expect(mockToggleColorMode).toHaveBeenCalledTimes(1);
});
