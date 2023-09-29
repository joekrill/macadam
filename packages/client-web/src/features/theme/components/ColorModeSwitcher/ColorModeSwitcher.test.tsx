import * as chakra from "@chakra-ui/react";
import { userEvent } from "@testing-library/user-event";
import { SpyInstance, afterEach, beforeEach, expect, test, vi } from "vitest";
import { render, screen } from "../../../../test-utils";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

const mockToggleColorMode = vi.fn();

vi.mock("@chakra-ui/react", async () => {
  const actual = await vi.importActual<typeof chakra>("@chakra-ui/react");
  return {
    ...actual,
    useColorMode: vi.fn(),
    useColorModeValue: vi.fn(),
  };
});

let useColorModeSpy: SpyInstance;
let useColorModeValueSpy: SpyInstance;

beforeEach(() => {
  mockToggleColorMode.mockReset();
  useColorModeSpy = vi.spyOn(chakra, "useColorMode").mockImplementation(() => ({
    toggleColorMode: mockToggleColorMode,
    colorMode: "dark",
    setColorMode: vi.fn(),
  }));

  useColorModeValueSpy = vi
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

test("toggles color mode when clicked", async () => {
  render(<ColorModeSwitcher />);
  const button = screen.getByRole("button");
  await userEvent.click(button);
  expect(mockToggleColorMode).toHaveBeenCalledTimes(1);
});
