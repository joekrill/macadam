import * as chakra from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test-utils";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

const toggleColorModeMock = jest.fn();
let useColorModeValueSpy: jest.SpyInstance;

beforeEach(() => {
  toggleColorModeMock.mockReset();
  jest.spyOn(chakra, "useColorMode").mockImplementation(() => ({
    toggleColorMode: toggleColorModeMock,
    colorMode: "dark",
    setColorMode: jest.fn(),
  }));

  useColorModeValueSpy = jest.spyOn(chakra, "useColorModeValue");
});

afterEach(() => {
  useColorModeValueSpy.mockRestore();
});

test("renders the expected aria label when in dark mode", () => {
  useColorModeValueSpy.mockImplementation((_light, dark) => dark);
  const { getByRole } = render(<ColorModeSwitcher />);
  const button = getByRole("button");
  expect(button.getAttribute("aria-label")).toContain("light");
});

test("renders the expected aria label when in light mode", () => {
  useColorModeValueSpy.mockImplementation((light, _dark) => light);
  const { getByRole } = render(<ColorModeSwitcher />);
  const button = getByRole("button");
  expect(button.getAttribute("aria-label")).toContain("dark");
});

test("toggles color mode when clicked", () => {
  render(<ColorModeSwitcher />);
  const button = screen.getByRole("button");
  userEvent.click(button);
  expect(toggleColorModeMock).toHaveBeenCalledTimes(1);
});
