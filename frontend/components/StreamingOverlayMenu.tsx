"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Box,
  Grid,
  Text,
  Icon,
  GridItem,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import useFullscreenStore from "../stores/fullscreenStore";
import {
  FaWindowMaximize,
  FaBars,
  FaChevronLeft,
  FaPowerOff,
  FaUser,
  FaHistory,
  FaCamera,
  FaExpandAlt,
  FaEdit,
  FaMapMarkerAlt,
  FaEye,
  FaQuestionCircle,
  FaTag,
  FaChevronRight,
  FaBackspace,
} from "react-icons/fa";

export default function StreamingOverlayMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeButtons, setActiveButtons] = useState<Record<string, boolean>>(
    {}
  );
  const { isFullscreen, toggleFullscreen } = useFullscreenStore();

  const handleButtonClick = (buttonValue: string) => {
    setActiveButtons((prev) => ({
      ...prev,
      [buttonValue]: !prev[buttonValue],
    }));
    console.log(buttonValue);
    if (buttonValue === "6") {
      toggleFullscreen();
    }
    if (buttonValue === "*") {
      setIsMenuOpen((isMenuOpen) => !isMenuOpen);
    }
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key;
    handleButtonClick(key);
  }, [handleButtonClick]);
  

  useEffect(() => {
    setActiveButtons((prev) => ({ ...prev, "6": isFullscreen }));
  }, [isFullscreen]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const buttonConfig = [
    { value: "Backspace", icon: FaBackspace, label: "", enable: false },
    {
      value: "/",
      icon: FaWindowMaximize,
      label: "Change version",
      enable: false,
    },
    {
      value: "*",
      icon: FaBars,
      label: "Show / Hide advance menu",
      enable: true,
    },
    { value: "-", label: "Decrease threshold", enable: true },
    { value: "7", icon: FaPowerOff, label: "On / Off switcher", enable: false },
    { value: "8", icon: FaUser, label: "Change state", enable: false },
    { value: "9", icon: FaHistory, label: "History", enable: false },
    { value: "+", label: "Increase threshold", enable: true },
    {
      value: "4",
      icon: FaCamera,
      label: "Polyp / GIM detection",
      enable: true,
    },
    { value: "5", icon: FaCamera, label: "Detect endoscope", enable: true },
    {
      value: "6",
      icon: FaExpandAlt,
      label: "Full screen / Minimized",
      enable: true,
    },
    { value: "1", icon: FaEdit, label: "Edit polyp", enable: false },
    {
      value: "2",
      icon: FaMapMarkerAlt,
      label: "Change location",
      enable: false,
    },
    { value: "3", icon: FaTag, label: "Change size", enable: false },
    { value: "Enter", icon: FaTag, label: "Tag polyp", enable: false },
    { value: "0", icon: FaEye, label: "Show / Hide UI", enable: true },
    { value: ".", icon: FaQuestionCircle, label: "Help", enable: true },
  ];

  return (
    <Box position="absolute" inset="0" zIndex="10" w="100%" h="100%">
      <IconButton
        position="absolute"
        top={0}
        left={0}
        icon={<FaBars />}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        colorScheme="white"
        aria-label="Toggle menu"
        size="lg"
        fontSize="2xl"
        zIndex={99}
      />
      {isMenuOpen && (
        <Box
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          p="4"
          borderRadius="lg"
          boxShadow="lg"
          bg="black"
          opacity="0.7"
        >
          <Grid
            templateColumns="repeat(4, 1fr)"
            gap="2"
            w={!isFullscreen ? "500px" : "500px"}
            h={!isFullscreen ? "700px" : "700px"}
          >
            {buttonConfig.map(({ value, icon, label, enable }) => (
              <GridItem
                key={value}
                colSpan={value === "0" ? 2 : 1}
                rowSpan={value === "+" ? 2 : 1}
              >
                <Button
                  key={value}
                  onClick={() => handleButtonClick(value)}
                  variant="outline"
                  isActive={activeButtons[value]}
                  flexDir="column"
                  justifyContent="center"
                  alignItems="center"
                  bg="black"
                  color="white"
                  _hover={{ bg: "white", color: "black" }}
                  _active={{ bg: "white", color: "black" }}
                  w="100%"
                  h="100%"
                >
                  {enable && (
                    <>
                      <HStack>
                        <Text fontSize="4xl">
                          {value !== "Backspace" ? value : ""}
                        </Text>

                        {icon && <Icon as={icon} boxSize={6} />}
                      </HStack>
                      <Text
                        mt="1"
                        textAlign="center"
                        fontSize="xs"
                        whiteSpace="normal"
                      >
                        {label}
                      </Text>{" "}
                    </>
                  )}
                </Button>
              </GridItem>
            ))}
            {/* <GridItem colSpan={2}>
              <Button
                variant="outline"
                h="20"
                justifyContent="center"
                width="100%"
                bg="black"
                color="white"
                _hover={{ bg: "white", color: "black" }}
                _active={{ bg: "white", color: "black" }}
              >
                <Icon as={FaQuestionCircle} boxSize={6} mr={2} />
                Help
              </Button>
            </GridItem>
            <GridItem colSpan={2}>
              <Button
                variant="outline"
                h="20"
                justifyContent="center"
                width="100%"
                bg="black"
                color="white"
                _hover={{ bg: "white", color: "black" }}
                _active={{ bg: "white", color: "black" }}
              >
                Enter
              </Button> 
            </GridItem> */}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
