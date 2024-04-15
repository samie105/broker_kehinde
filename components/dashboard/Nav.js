"use client";
import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Sheeet from "./sheeet";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Link from "next/link";
import axios from "axios";
import { useUserData } from "../../contexts/userrContext";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { useTheme } from "../../contexts/themeContext";
import { ScrollArea } from "../ui/scroll-area";

export default function Nav() {
  const router = useRouter();
  const { isDarkMode, baseColor, toggleTheme } = useTheme();
  const { coinPrices, setCoinPrices } = useUserData();
  const [loading, isloading] = useState(false);
  const { details, email, setDetails } = useUserData();
  const deposits = [
    {
      coinName: "Bitcoin",
      short: "Bitcoin",
      image: "/assets/bitcoin.webp",
      address: "0xiohxhihfojdokhijkhnofwefodsdhfodhod",
    },
    {
      coinName: "Ethereum",
      short: "Ethereum",
      image: "/assets/ethereum.webp",
      address: "0xiohxhihfojhijkhnowefodsdhfodhod",
    },
    {
      coinName: "Tether USDT",
      short: "Tether",
      image: "/assets/Tether.webp",
      address: "0Xxiohxhihfookhijkhnofwefodsdhfodhod",
    },
  ];
  const handleReadNotif = async () => {
    if (!details.isReadNotifications) {
      try {
        // Send a POST request to mark notifications as read
        const response = await axios.post(`/notifs/readNotifs/api`, { email });

        if (response.status === 200) {
          // Notifications marked as read successfully
          // Now, you can update the user's details to set isReadNotifications to true
          setDetails((prevDetails) => ({
            ...prevDetails,
            isReadNotifications: true,
          }));
        } else {
          // Handle any errors or display an error message to the user
          console.error("Failed to mark notifications as read:", response.data);
        }
      } catch (error) {
        // Handle network errors or other unexpected errors
        console.error("Error marking notifications as read:", error);
      }
    }
  };
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (details.notifications && details.notifications.length > 0) {
      setNotifications(details.notifications);
    }
  }, [details]);

  // ...

  const formatRelativeTime = (dateString) => {
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Calculate the relative time to now
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Map over notifications and format the date as relative time for each
  const formattedNotifications = notifications
    ? notifications.map((notification) => ({
        ...notification,
        date: formatRelativeTime(notification.date), // Format as relative time
      }))
    : [];
  const sortedNotifications = formattedNotifications.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // Compare dates in descending order (newest first)
  });

  const handleNotificationClick = (id) => {
    isloading(true);
    // Send a DELETE request to the backend API to delete the notification
    axios
      .delete(`/notifs/deleteNotifs/api/${id}/${email}`)
      .then((response) => {
        if (response.status === 200) {
          const updatedNotifications = notifications.filter(
            (notification) => notification.id !== id
          );
          setNotifications(updatedNotifications);
          isloading(false);
        } else {
          // Handle any errors or display an error message to the user
          console.error("Failed to delete notification:", response.data);
          isloading(false);
        }
      })
      .catch((error) => {
        // Handle network errors or other unexpected errors
        console.error("Error deleting notification:", error);
        isloading(false);
      });
  };
  useEffect(() => {
    const fetchCoinPrices = async () => {
      try {
        // Create an array of coin symbols for API request
        const coinSymbols = deposits.map((coin) => coin.short.toLowerCase());

        // API request to fetch coin prices
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinSymbols.join(
            ","
          )}&vs_currencies=usd`
        );

        // Update coinPrices state with fetched prices
        setCoinPrices(response.data);
      } catch (error) {
        console.error("Error fetching coin prices:", error);
      }
    };

    fetchCoinPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    // Remove the "token" cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to the logout page or any other desired action
    router.replace("/auth"); // Replace "/logout" with your actual logout route
  };

  return (
    <>
      <div
        className={`nav-container flex justify-between ${
          isDarkMode
            ? `${baseColor} text-white border border-white/5`
            : "text-slate-900 border-b bg-white"
        } duration-300  items-center py-3 px-5 transition-colors  `}
      >
        <div className="burger md:hidden cursor-pointer">
          <Sheet className="p-0">
            <SheetTrigger>
              <div className="burger-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </SheetTrigger>
            <SheetContent
              side="left"
              className={`px-4 ${
                isDarkMode ? `${baseColor} text-gray-200 border-0` : ""
              }`}
            >
              <Sheeet />
            </SheetContent>
          </Sheet>
        </div>
        <div className="title hidden md:flex">
          <h2 className="font-bold">
            <svg
              width="232"
              height="46"
              viewBox="0 0 232 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23 0C16.9 -2.66639e-07 11.0499 2.42321 6.73655 6.73654C2.42321 11.0499 7.27174e-07 16.9 0 23C-7.27174e-07 29.1 2.42321 34.9501 6.73654 39.2635C11.0499 43.5768 16.9 46 23 46L23 43.1135C17.6656 43.1135 12.5496 40.9944 8.77761 37.2224C5.00559 33.4504 2.8865 28.3344 2.8865 23C2.8865 17.6656 5.0056 12.5496 8.77761 8.77761C12.5496 5.0056 17.6656 2.8865 23 2.8865L23 0Z"
                fill={`${isDarkMode ? "white" : "#444"}`}
              />
              <path
                d="M23 46C29.1 46 34.9501 43.5768 39.2635 39.2635C43.5768 34.9501 46 29.1 46 23C46 16.9 43.5768 11.0499 39.2635 6.73655C34.9501 2.42321 29.1 1.18771e-06 23 0L23 2.88544C28.3347 2.88544 33.4509 5.00465 37.2231 8.77686C40.9954 12.5491 43.1146 17.6653 43.1146 23C43.1146 28.3347 40.9954 33.4509 37.2231 37.2231C33.4509 40.9954 28.3347 43.1146 23 43.1146L23 46Z"
                fill="#0052FF"
              />
              <path
                d="M7.99219 22.8203C7.99219 21.9505 8.15625 21.1406 8.48438 20.3906C8.8125 19.6354 9.28646 18.9818 9.90625 18.4297C10.5312 17.8724 11.2917 17.4349 12.1875 17.1172C13.0885 16.7995 14.1068 16.6406 15.2422 16.6406C16.237 16.6406 17.1484 16.7422 17.9766 16.9453C18.8099 17.1432 19.5833 17.4479 20.2969 17.8594L19.1562 19.7344C18.9427 19.5938 18.6953 19.4688 18.4141 19.3594C18.138 19.25 17.8411 19.1589 17.5234 19.0859C17.2109 19.0078 16.8854 18.9479 16.5469 18.9062C16.2135 18.8646 15.8828 18.8438 15.5547 18.8438C14.763 18.8438 14.0573 18.9427 13.4375 19.1406C12.8177 19.3333 12.2943 19.6068 11.8672 19.9609C11.4453 20.3099 11.1224 20.7292 10.8984 21.2188C10.6797 21.7031 10.5703 22.237 10.5703 22.8203C10.5703 23.4245 10.6849 23.9792 10.9141 24.4844C11.1432 24.9896 11.474 25.4271 11.9062 25.7969C12.3438 26.1615 12.875 26.4479 13.5 26.6562C14.1302 26.8594 14.8411 26.9609 15.6328 26.9609C15.9922 26.9609 16.349 26.9349 16.7031 26.8828C17.0573 26.8307 17.3984 26.7604 17.7266 26.6719C18.0599 26.5781 18.3802 26.4688 18.6875 26.3438C18.9948 26.2135 19.2812 26.0729 19.5469 25.9219L20.6875 27.7969C20.0208 28.224 19.25 28.5599 18.375 28.8047C17.5 29.0443 16.5703 29.1641 15.5859 29.1641C14.3307 29.1641 13.2292 29.0026 12.2812 28.6797C11.3333 28.3516 10.5417 27.9036 9.90625 27.3359C9.27083 26.763 8.79167 26.0911 8.46875 25.3203C8.15104 24.5443 7.99219 23.7109 7.99219 22.8203Z"
                fill={`${isDarkMode ? "white" : "#444"}`}
              />
              <path
                d="M23.4297 16.7891H25.9062L30.3438 21.2422L34.7812 16.7891H37.2578V29H34.7812V20.2188L30.3438 24.4922L25.9062 20.2188V29H23.4297V16.7891Z"
                fill="#0052FF"
              />
              <path
                d="M53.8682 22.5928C53.8682 21.8317 54.0117 21.123 54.2988 20.4668C54.5859 19.806 55.0007 19.234 55.543 18.751C56.0898 18.2633 56.7552 17.8805 57.5391 17.6025C58.3275 17.3245 59.2184 17.1855 60.2119 17.1855C61.0824 17.1855 61.8799 17.2744 62.6045 17.4521C63.3337 17.6253 64.0104 17.8919 64.6348 18.252L63.6367 19.8926C63.4499 19.7695 63.2334 19.6602 62.9873 19.5645C62.7458 19.4688 62.486 19.389 62.208 19.3252C61.9346 19.2568 61.6497 19.2044 61.3535 19.168C61.0618 19.1315 60.7725 19.1133 60.4854 19.1133C59.7926 19.1133 59.1751 19.1999 58.6328 19.373C58.0905 19.5417 57.6325 19.7809 57.2588 20.0908C56.8896 20.3962 56.6071 20.763 56.4111 21.1914C56.2197 21.6152 56.124 22.0824 56.124 22.5928C56.124 23.1214 56.2243 23.6068 56.4248 24.0488C56.6253 24.4909 56.9147 24.8737 57.293 25.1973C57.6758 25.5163 58.1406 25.7669 58.6875 25.9492C59.2389 26.127 59.861 26.2158 60.5537 26.2158C60.8682 26.2158 61.1803 26.193 61.4902 26.1475C61.8001 26.1019 62.0986 26.0404 62.3857 25.9629C62.6774 25.8809 62.9577 25.7852 63.2266 25.6758C63.4954 25.5618 63.7461 25.4388 63.9785 25.3066L64.9766 26.9473C64.3932 27.321 63.7188 27.6149 62.9531 27.8291C62.1875 28.0387 61.374 28.1436 60.5127 28.1436C59.4144 28.1436 58.4505 28.0023 57.6211 27.7197C56.7917 27.4326 56.099 27.0407 55.543 26.5439C54.987 26.0426 54.5677 25.4548 54.2852 24.7803C54.0072 24.1012 53.8682 23.3721 53.8682 22.5928ZM66.7402 22.627C66.7402 21.8203 66.8883 21.082 67.1846 20.4121C67.4808 19.7422 67.8955 19.168 68.4287 18.6895C68.9665 18.2064 69.609 17.8327 70.3564 17.5684C71.1084 17.304 71.9401 17.1719 72.8516 17.1719C73.7585 17.1719 74.5879 17.304 75.3398 17.5684C76.0918 17.8327 76.7344 18.2064 77.2676 18.6895C77.8053 19.168 78.2223 19.7422 78.5186 20.4121C78.8148 21.082 78.9629 21.8203 78.9629 22.627C78.9629 23.4382 78.8148 24.1833 78.5186 24.8623C78.2223 25.5368 77.8053 26.1178 77.2676 26.6055C76.7344 27.0931 76.0918 27.4736 75.3398 27.7471C74.5879 28.016 73.7585 28.1504 72.8516 28.1504C71.9401 28.1504 71.1084 28.016 70.3564 27.7471C69.609 27.4736 68.9665 27.0931 68.4287 26.6055C67.8955 26.1178 67.4808 25.5368 67.1846 24.8623C66.8883 24.1833 66.7402 23.4382 66.7402 22.627ZM68.9072 22.627C68.9072 23.1784 69.0052 23.6751 69.2012 24.1172C69.4017 24.5592 69.6774 24.9375 70.0283 25.252C70.3838 25.5618 70.8008 25.8011 71.2793 25.9697C71.7624 26.1383 72.2865 26.2227 72.8516 26.2227C73.4167 26.2227 73.9385 26.1383 74.417 25.9697C74.9001 25.8011 75.3171 25.5618 75.668 25.252C76.0189 24.9375 76.2946 24.5592 76.4951 24.1172C76.6956 23.6751 76.7959 23.1784 76.7959 22.627C76.7959 22.0755 76.6956 21.5811 76.4951 21.1436C76.2946 20.7061 76.0189 20.3369 75.668 20.0361C75.3171 19.7308 74.9001 19.4984 74.417 19.3389C73.9385 19.1794 73.4167 19.0996 72.8516 19.0996C72.2865 19.0996 71.7624 19.1794 71.2793 19.3389C70.8008 19.4984 70.3838 19.7308 70.0283 20.0361C69.6774 20.3369 69.4017 20.7061 69.2012 21.1436C69.0052 21.5811 68.9072 22.0755 68.9072 22.627ZM81.0957 17.3154H83.2764V28H81.0957V17.3154ZM86.0312 17.3154H88.1982L94.8564 20.8018V17.3154H97.0234V28H94.8564V23.0986L88.1982 19.6328V28H86.0312V17.3154ZM103.265 19.2158H99.3203V17.3154H109.376V19.2158H105.432V28H103.265V19.2158ZM111.693 17.3154H117.128C117.948 17.3154 118.659 17.402 119.261 17.5752C119.862 17.7438 120.361 17.9899 120.758 18.3135C121.154 18.637 121.448 19.0312 121.64 19.4961C121.836 19.9609 121.934 20.4873 121.934 21.0752C121.934 21.4717 121.886 21.8499 121.79 22.21C121.694 22.5654 121.546 22.8936 121.346 23.1943C121.15 23.4951 120.901 23.764 120.601 24.001C120.3 24.2334 119.947 24.4271 119.541 24.582L121.865 28H119.213L117.203 24.9648H117.142L113.86 24.958V28H111.693V17.3154ZM117.183 23.085C117.593 23.085 117.951 23.0371 118.256 22.9414C118.566 22.8457 118.823 22.7113 119.028 22.5381C119.238 22.3649 119.393 22.1553 119.493 21.9092C119.598 21.6585 119.65 21.3805 119.65 21.0752C119.65 20.4782 119.445 20.0179 119.035 19.6943C118.625 19.3662 118.007 19.2021 117.183 19.2021H113.86V23.085H117.183ZM124.101 17.3154H126.268V23.2012C126.268 23.6842 126.334 24.1149 126.466 24.4932C126.598 24.8669 126.794 25.1836 127.054 25.4434C127.318 25.7031 127.644 25.9014 128.031 26.0381C128.419 26.1702 128.87 26.2363 129.385 26.2363C129.895 26.2363 130.344 26.1702 130.731 26.0381C131.123 25.9014 131.449 25.7031 131.709 25.4434C131.973 25.1836 132.172 24.8669 132.304 24.4932C132.436 24.1149 132.502 23.6842 132.502 23.2012V17.3154H134.669V23.4609C134.669 24.1628 134.55 24.8008 134.313 25.375C134.076 25.9492 133.732 26.4414 133.281 26.8516C132.83 27.2617 132.276 27.5785 131.62 27.8018C130.968 28.0251 130.223 28.1367 129.385 28.1367C128.546 28.1367 127.799 28.0251 127.143 27.8018C126.491 27.5785 125.939 27.2617 125.488 26.8516C125.037 26.4414 124.693 25.9492 124.456 25.375C124.219 24.8008 124.101 24.1628 124.101 23.4609V17.3154ZM137.813 24.8213C138.201 25.04 138.593 25.2383 138.989 25.416C139.39 25.5892 139.805 25.7373 140.233 25.8604C140.662 25.9788 141.111 26.07 141.58 26.1338C142.054 26.1976 142.558 26.2295 143.091 26.2295C143.733 26.2295 144.28 26.1885 144.731 26.1064C145.183 26.0199 145.549 25.9036 145.832 25.7578C146.119 25.6074 146.326 25.4297 146.454 25.2246C146.586 25.0195 146.652 24.7962 146.652 24.5547C146.652 24.1673 146.491 23.862 146.167 23.6387C145.843 23.4108 145.344 23.2969 144.67 23.2969C144.374 23.2969 144.062 23.3174 143.733 23.3584C143.405 23.3949 143.073 23.4359 142.735 23.4814C142.403 23.527 142.072 23.5703 141.744 23.6113C141.421 23.6478 141.115 23.666 140.828 23.666C140.35 23.666 139.889 23.6045 139.447 23.4814C139.01 23.3584 138.62 23.1738 138.278 22.9277C137.941 22.6816 137.672 22.374 137.472 22.0049C137.271 21.6357 137.171 21.2051 137.171 20.7129C137.171 20.4212 137.21 20.1318 137.287 19.8447C137.369 19.5576 137.497 19.2842 137.67 19.0244C137.848 18.7601 138.076 18.5163 138.354 18.293C138.632 18.0651 138.966 17.8691 139.358 17.7051C139.755 17.541 140.211 17.4134 140.726 17.3223C141.245 17.2266 141.835 17.1787 142.496 17.1787C142.975 17.1787 143.455 17.2061 143.938 17.2607C144.422 17.3109 144.891 17.3838 145.347 17.4795C145.807 17.5752 146.249 17.6914 146.673 17.8281C147.097 17.9603 147.491 18.1084 147.855 18.2725L146.905 20.0225C146.604 19.8903 146.281 19.7695 145.935 19.6602C145.588 19.5462 145.226 19.4482 144.848 19.3662C144.469 19.2842 144.077 19.2204 143.672 19.1748C143.271 19.1247 142.861 19.0996 142.441 19.0996C141.844 19.0996 141.352 19.1429 140.965 19.2295C140.582 19.3161 140.277 19.4277 140.049 19.5645C139.821 19.6966 139.661 19.847 139.57 20.0156C139.484 20.1797 139.44 20.3438 139.44 20.5078C139.44 20.8268 139.584 21.0889 139.871 21.2939C140.158 21.4945 140.596 21.5947 141.184 21.5947C141.421 21.5947 141.692 21.5788 141.997 21.5469C142.307 21.5104 142.631 21.4717 142.968 21.4307C143.31 21.3896 143.656 21.3532 144.007 21.3213C144.362 21.2848 144.706 21.2666 145.039 21.2666C145.668 21.2666 146.224 21.3372 146.707 21.4785C147.195 21.6198 147.603 21.8226 147.931 22.0869C148.259 22.3467 148.507 22.6634 148.676 23.0371C148.844 23.4062 148.929 23.821 148.929 24.2812C148.929 24.8965 148.785 25.4456 148.498 25.9287C148.215 26.4072 147.81 26.8128 147.281 27.1455C146.757 27.4736 146.124 27.7243 145.381 27.8975C144.638 28.0661 143.811 28.1504 142.899 28.1504C142.298 28.1504 141.71 28.1117 141.136 28.0342C140.562 27.9613 140.01 27.8564 139.481 27.7197C138.957 27.5785 138.456 27.4121 137.978 27.2207C137.504 27.0247 137.064 26.8105 136.658 26.5781L137.813 24.8213ZM154.534 19.2158H150.59V17.3154H160.646V19.2158H156.701V28H154.534V19.2158Z"
                fill={`${isDarkMode ? "white" : "#444"}`}
              />
              <path
                d="M167.618 17.3154H169.785L173.668 21.2119L177.551 17.3154H179.718V28H177.551V20.3164L173.668 24.0557L169.785 20.3164V28H167.618V17.3154ZM182.486 17.3154H184.667V28H182.486V17.3154ZM187.422 17.3154H189.589L196.247 20.8018V17.3154H198.414V28H196.247V23.0986L189.589 19.6328V28H187.422V17.3154ZM201.162 17.3154H203.343V28H201.162V17.3154ZM206.098 17.3154H208.265L214.923 20.8018V17.3154H217.09V28H214.923V23.0986L208.265 19.6328V28H206.098V17.3154ZM219.38 22.5586C219.38 21.8066 219.521 21.1048 219.804 20.4531C220.086 19.7969 220.499 19.2272 221.041 18.7441C221.583 18.2611 222.249 17.8805 223.037 17.6025C223.83 17.3245 224.737 17.1855 225.758 17.1855C226.127 17.1855 226.496 17.2061 226.865 17.2471C227.239 17.2835 227.606 17.3428 227.966 17.4248C228.33 17.5068 228.684 17.6117 229.025 17.7393C229.372 17.8623 229.7 18.0104 230.01 18.1836L229.012 19.8242C228.825 19.7148 228.613 19.6169 228.376 19.5303C228.139 19.4391 227.884 19.3639 227.61 19.3047C227.341 19.2409 227.061 19.193 226.77 19.1611C226.482 19.1292 226.193 19.1133 225.901 19.1133C225.227 19.1133 224.625 19.1999 224.097 19.373C223.568 19.5417 223.121 19.7809 222.757 20.0908C222.392 20.3962 222.114 20.763 221.923 21.1914C221.731 21.6198 221.636 22.0892 221.636 22.5996C221.636 23.1283 221.736 23.6136 221.937 24.0557C222.137 24.4977 222.422 24.8783 222.791 25.1973C223.16 25.5163 223.607 25.7669 224.131 25.9492C224.655 26.127 225.241 26.2158 225.888 26.2158C226.403 26.2158 226.874 26.1589 227.303 26.0449C227.731 25.9264 228.105 25.7601 228.424 25.5459C228.743 25.3317 229.003 25.0742 229.203 24.7734C229.404 24.4681 229.536 24.1263 229.6 23.748H225.867V21.9639H231.548V21.9707L231.555 21.9639C231.669 22.5107 231.703 23.0439 231.657 23.5635C231.616 24.0785 231.498 24.5661 231.302 25.0264C231.11 25.4821 230.846 25.9014 230.509 26.2842C230.172 26.667 229.768 26.9974 229.299 27.2754C228.829 27.5488 228.296 27.763 227.699 27.918C227.102 28.0684 226.448 28.1436 225.737 28.1436C224.744 28.1436 223.853 27.9977 223.064 27.7061C222.281 27.4144 221.615 27.0156 221.068 26.5098C220.521 26.0039 220.102 25.4115 219.811 24.7324C219.523 24.0534 219.38 23.3288 219.38 22.5586Z"
                fill="#0052FF"
              />
            </svg>
          </h2>
        </div>{" "}
        {details === 0 ? (
          <div className="flex items-center gap-x-3">
            {" "}
            <Skeleton
              className={`md:w-52 md:h-10 rounded-md  ${
                isDarkMode ? "bg-[#333]" : "bg-gray-200/80"
              }  w-24 h-10`}
            />
            <Skeleton
              className={`md:w-52 md:h-10 md:rounded-sm  ${
                isDarkMode ? "bg-[#333]" : "bg-gray-200/80"
              } w-10 h-10 rounded-full`}
            />
            <Skeleton
              className={`md:w-10 md:h-10 rounded-full ${
                isDarkMode ? "bg-[#333]" : "bg-gray-200/80"
              } w-10 h-10`}
            />
          </div>
        ) : (
          <div className="nav-tools text-sm flex items-center">
            <Select defaultValue="Balance">
              <SelectTrigger
                className={`${isDarkMode ? "border border-[#222]" : "border"}`}
              >
                <SelectValue className="outline-none " />
              </SelectTrigger>
              <SelectContent
                className={`outline-none focus:outline-none ${
                  isDarkMode ? `${baseColor} text-white border-0` : ""
                }`}
              >
                <SelectItem value="Balance">
                  <div className="flex items-center py-2">
                    <div className="w-5 h-5 ">
                      {" "}
                      <Image
                        alt=""
                        src="/assets/dollar.png"
                        width={1000}
                        height={10000}
                      />
                    </div>
                    <div className="text-sm font-bold mx-2">
                      <code>{details.tradingBalance.toLocaleString()}</code>
                    </div>
                  </div>
                </SelectItem>
                {deposits.map((deps, index) => (
                  <div key={deps.coinName}>
                    <SelectItem key={deps.coinName} value={deps.coinName}>
                      <div className="flex items-center py-2">
                        <div className="image">
                          <Image
                            src={deps.image}
                            alt=""
                            width={20}
                            height={15}
                          />
                        </div>
                        <div className="price text-sm mx-2 font-bold">
                          {details !== 0 && details !== null ? (
                            <code>
                              {coinPrices[deps.short.toLowerCase()]
                                ? (
                                    details.tradingBalance /
                                    coinPrices[deps.short.toLowerCase()].usd
                                  ).toFixed(5)
                                : "0.00"}
                            </code>
                          ) : (
                            <span>calculating...</span>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  </div>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger onClick={handleReadNotif}>
                <div className="notif-cont  ml-3 relative">
                  <div
                    className={` flex font-bold ${
                      isDarkMode
                        ? `md:bg-[#0052FF10] text-[#0052FF]`
                        : "md:bg-[#0052FF10] text-[#0052FF]"
                    } rounded-full md:rounded-lg md:px-3 md:py-3`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="md:w-5 md:h-5 w-5 h-5 md:mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 8a6 6 0 1112 0c0 1.887.454 3.665 1.257 5.234a.75.75 0 01-.515 1.076 32.903 32.903 0 01-3.256.508 3.5 3.5 0 01-6.972 0 32.91 32.91 0 01-3.256-.508.75.75 0 01-.515-1.076A11.448 11.448 0 004 8zm6 7c-.655 0-1.305-.02-1.95-.057a2 2 0 003.9 0c-.645.038-1.295.057-1.95.057zM8.75 6a.75.75 0 000 1.5h1.043L8.14 9.814A.75.75 0 008.75 11h2.5a.75.75 0 000-1.5h-1.043l1.653-2.314A.75.75 0 0011.25 6h-2.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div
                      className={`hidden md:block  ${
                        isDarkMode ? "text-[#0052FF]" : "text-[#0052FF]"
                      }`}
                    >
                      Notifications
                    </div>
                  </div>

                  {!details.isReadNotifications && (
                    <div className="notifier-dot absolute md:-right-1 right-0  top-0">
                      <div className="dot bg-red-500 md:w-3 md:h-3 animate__rubberBand animate__animated animate__infinite rounded-full w-2 h-2"></div>
                    </div>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent
                className={`w-[350px] md:w-[400px] mx-3 pb-0 pt-4 px-1 relative overflow-hidden ${
                  isDarkMode ? "bg-[#222] border-white/5 text-gray-200" : ""
                }`}
              >
                <div className="tit px-3">
                  <div className="flex w-full justify-between items-center pb-4">
                    <div
                      className={`title-name font-bold ${
                        isDarkMode ? "text-white" : "text-black/90"
                      }`}
                    >
                      Notifications
                    </div>
                    <div className="titcount fleex">
                      <div className=" ">
                        <div
                          className={`py-1 px-2 rounded-full text-xs font-bold ${
                            isDarkMode ? "bg-[#333]" : "bg-black/5"
                          }`}
                        >
                          {notifications.length}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`line w-1/2 mx-auto mb-2 h-0.5  rounded-full ${
                      isDarkMode ? "bg-white/5" : "bg-black/5"
                    }`}
                  ></div>
                </div>
                <div className="cont ">
                  {notifications.length === 0 && (
                    <>
                      {" "}
                      <div className="message text-center text-sm py-4">
                        No notifications yet
                      </div>
                    </>
                  )}
                  {loading && (
                    <div
                      className={`loader-overlay absolute w-full h-full ${
                        isDarkMode ? "bg-black" : "bg-white"
                      } opacity-60 left-0 top-0 blur-2xl z-50`}
                    ></div>
                  )}
                  {notifications.length !== 0 && (
                    <>
                      <div>
                        <div className=" max-h-[300px] overflow-scroll overflow-x-hidden w-full px-3 py-3">
                          {sortedNotifications.reverse().map((notif, index) => (
                            <>
                              <div
                                className={`flex justify-between w-full items-start cursor-pointer transition-all`}
                                key={crypto.randomUUID()}
                              >
                                <div className="icon flex items-center flex-col">
                                  <div
                                    className={`${
                                      notif.method === "success"
                                        ? isDarkMode
                                          ? "bg-green-500/10 text-green-500"
                                          : "bg-green-500/20 text-green-500"
                                        : notif.method === "failure"
                                        ? isDarkMode
                                          ? "bg-red-500/10 text-red-500"
                                          : "bg-red-500/20 text-red-500"
                                        : notif.method === "pending"
                                        ? isDarkMode
                                          ? "bg-orange-500/10 text-orange-500"
                                          : "bg-orange-500/20 text-orange-500"
                                        : isDarkMode
                                        ? "bg-[#333] text-white"
                                        : "bg-[#33333320] text-white"
                                    } rounded-full p-3`}
                                  >
                                    {notif.type === "trade" ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : notif.type === "transaction" ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M13.2 2.24a.75.75 0 00.04 1.06l2.1 1.95H6.75a.75.75 0 000 1.5h8.59l-2.1 1.95a.75.75 0 101.02 1.1l3.5-3.25a.75.75 0 000-1.1l-3.5-3.25a.75.75 0 00-1.06.04zm-6.4 8a.75.75 0 00-1.06-.04l-3.5 3.25a.75.75 0 000 1.1l3.5 3.25a.75.75 0 101.02-1.1l-2.1-1.95h8.59a.75.75 0 000-1.5H4.66l2.1-1.95a.75.75 0 00.04-1.06z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : notif.type === "intro" ? (
                                      <>🤝</>
                                    ) : notif.type === "verification" ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-4 h-4 text-sm"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <div
                                    className={`linedwon   ${
                                      notif.method === "success"
                                        ? isDarkMode
                                          ? "bg-green-500/10 text-green-500"
                                          : "bg-green-500/20 text-green-500"
                                        : notif.method === "failure"
                                        ? isDarkMode
                                          ? "bg-red-500/10 text-red-500"
                                          : "bg-red-500/20 text-red-500"
                                        : notif.method === "pending"
                                        ? isDarkMode
                                          ? "bg-orange-500/10 text-orange-500"
                                          : "bg-orange-500/20 text-orange-500"
                                        : isDarkMode
                                        ? "bg-[#333] text-white"
                                        : "bg-[#33333320] text-white"
                                    } ${
                                      index !== notifications.length - 1
                                        ? "h-11 border border-dashed border-white/5"
                                        : ""
                                    }`}
                                    key={crypto.randomUUID()}
                                  ></div>
                                </div>
                                <div className="message w-full text-sm mx-2">
                                  <div
                                    className={`pb-1 pt-1 ${
                                      isDarkMode
                                        ? "text-white"
                                        : "text-black/90 font-bold"
                                    }`}
                                  >
                                    {" "}
                                    {notif.message}
                                  </div>
                                  <div
                                    className={`date text-xs capitalize ${
                                      isDarkMode ? "opacity-40" : "opacity-80"
                                    }`}
                                  >
                                    {notif.date}
                                  </div>
                                </div>
                                <div
                                  className="actiom pt-3 h-full /w-full"
                                  onClick={() =>
                                    handleNotificationClick(notif.id)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className={`w-4 h-4 ${
                                      isDarkMode
                                        ? "text-white/50 hover:text-white/80"
                                        : "text-black/30 hover:text-black/50"
                                    }`}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <button
              className={`theme-toggler  md:p-3  ${
                isDarkMode
                  ? "md:bg-[#0052FF20] text-[#0052FF] "
                  : "md:bg-[#0052FF10] text-[#0052FF]"
              } rounded-full mx-5 md:mx-2`}
              onClick={toggleTheme}
            >
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`w-5 h-5 
                          }`}
                >
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-5 h-5 
                          }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <Popover>
              <PopoverTrigger>
                <div
                  className={`flex font-bold text-[#0052FF] rounded-full md:p-3 ${
                    isDarkMode ? "md:bg-[#0052FF20]" : "md:bg-[#0052FF10]"
                  } md:mr-5 text-sm`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 "
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className={`w-[300px] mx-3  p-1   ${
                  isDarkMode ? "bg-[#111] text-white border border-white/5" : ""
                }`}
              >
                {/* <div className="header-title py-4 px-4 font-bold">
                  <h1 className="bgname text-lg">Menus</h1>
                </div> */}
                <div className="content1 grid grid-cols-3 gap-y-4 py-3 pt-5 gap-x-3 px-3">
                  <Link href="/dashboard/account" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/profile.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Profile</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/deposits" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/wallet.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />
                      <p className="pt-2">Deposit</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/withdrawals" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/withdraw.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />
                      <p className="pt-2">Withdraw</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/markets" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3 relative ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <div className="identifier absolute -top-1 -right-2">
                        <div className="px-2  font-normal bg-green-500 rounded-md text-white  text-[10px]">
                          Live
                        </div>
                      </div>
                      <Image
                        alt=""
                        src="/assets/increase.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Tradings</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/investments" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/money.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Subscription</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/verify" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  relative ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <div className="verification-identifier absolute -top-1 -right-2">
                        {details.isVerified ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-green-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-red-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <Image
                        alt=""
                        src="/assets/veraccount.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Verification</p>
                    </div>
                  </Link>
                </div>{" "}
                <div className="relative w-full flex items-center justify-center pt-4">
                  <div
                    className={` line h-0.5 w-1/2 mx-auto top-0 left-0 ${
                      isDarkMode ? "bg-white/5" : "bg-black/10"
                    } rounded-full`}
                  ></div>
                </div>
                <div
                  className={`logout flex items-center text-sm py-3 mb-4 mx-3 rounded-md text-red-600 mt-4 ${
                    isDarkMode
                      ? "bg-red-500/10 /border /border-red-600 font-bold"
                      : "bg-red-50"
                  } px-2 font-bold cursor-pointer`}
                  onClick={handleLogout}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5A.75.75 0 0110 2zM5.404 4.343a.75.75 0 010 1.06 6.5 6.5 0 109.192 0 .75.75 0 111.06-1.06 8 8 0 11-11.313 0 .75.75 0 011.06 0z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <p>Logout</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </>
  );
}
