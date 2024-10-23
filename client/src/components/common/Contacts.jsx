import React, { useEffect, useState, useRef } from "react";
import { IoIosPeople, IoMdContacts } from "react-icons/io";

import useCloseModal from "../../hooks/useCloseModal.js";
import DisplayContactsModal from "./DisplayContactsModal.jsx";

const Contacts = () => {
  const [showContacts, setShowContacts] = useState(false);

  const contactsModalRef = useRef();
  useCloseModal(contactsModalRef, () => setShowContacts(false));

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        contactsModalRef?.current &&
        !contactsModalRef?.current?.contains(event.target)
      ) {
        setShowContacts(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  return (
    <>
      <div
        className="flex items-center mx-1 rounded-lg light-search cursor-pointer"
        onClick={() => setShowContacts(!showContacts)}
      >
        <IoMdContacts className="w-9 h-9  px-2  rounded-lg" />
      </div>
      {showContacts ? (
        <DisplayContactsModal
          contactsModalRef={contactsModalRef}
          showContacts={showContacts}
        />
      ) : null}
    </>
  );
};

export default Contacts;
