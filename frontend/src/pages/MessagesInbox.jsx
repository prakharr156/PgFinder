import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./messagesInbox.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function getErrorMessage(data, fallback) {
  if (typeof data?.error === "string") return data.error;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((error) => error.msg).join(" ");
  }

  return fallback;
}

const MessagesInbox = ({
  inboxConversations: inboxConversationsProp,
  activeConversation: activeConversationProp,
  isProvider: isProviderProp = false,
  user,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [messageContent, setMessageContent] = useState("");
  const [sendStatus, setSendStatus] = useState("");
  const [inboxData, setInboxData] = useState({
    inboxConversations: inboxConversationsProp || [],
    activeConversation: activeConversationProp || null,
    isProvider: isProviderProp,
    loading: !inboxConversationsProp && !activeConversationProp,
    error: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadInbox = async () => {
      setInboxData((prev) => ({
        ...prev,
        loading: true,
        error: "",
      }));

      try {
        const res = await fetch(`${backendUrl}${location.pathname}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(getErrorMessage(data, "Could not load messages."));
        }

        if (!isMounted) return;

        setInboxData({
          inboxConversations: data.inboxConversations || [],
          activeConversation: data.activeConversation || null,
          isProvider: data.isProvider || false,
          loading: false,
          error: "",
        });
      } catch (error) {
        if (!isMounted) return;

        console.log(error);
        setInboxData((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "Could not load messages.",
        }));
      }
    };

    loadInbox();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  const {
    inboxConversations,
    activeConversation,
    isProvider,
    loading,
    error,
  } = inboxData;

  const activeContact = activeConversation
    ? isProvider
      ? activeConversation.rider
      : activeConversation.provider
    : null;

  const activeProperty = activeConversation
    ? activeConversation.property
    : null;
  const currentRole = isProvider ? "provider" : "rider";

  const reloadInbox = async () => {
    const res = await fetch(`${backendUrl}${location.pathname}`, {
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(getErrorMessage(data, "Could not reload messages."));
    }

    setInboxData({
      inboxConversations: data.inboxConversations || [],
      activeConversation: data.activeConversation || null,
      isProvider: data.isProvider || false,
      loading: false,
      error: "",
    });
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const content = messageContent.trim();
    if (!content || !activeConversation) return;

    setSendStatus("Sending...");

    try {
      const postPath = location.pathname.startsWith("/messages/property/")
        ? location.pathname
        : `/messages/${activeConversation._id}`;

      const res = await fetch(`${backendUrl}${postPath}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(getErrorMessage(data, "Could not send message."));
      }

      setMessageContent("");
      setSendStatus(data.success || "Message sent.");

      if (data.redirectTo && data.redirectTo !== location.pathname) {
        navigate(data.redirectTo);
        return;
      }

      await reloadInbox();
    } catch (error) {
      console.log(error);
      setSendStatus(error.message || "Could not send message.");
    }
  };

  if (loading) {
    return (
      <section className="messages-page">
        <div className="container">
          <div className="messages-card messages-empty">
            Loading messages...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="messages-page">
        <div className="container">
          <div className="messages-card messages-empty">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="messages-page">
      <div className="container">
        <div className="messages-shell">

          {/* Sidebar */}
          <aside className="messages-card messages-sidebar">
            <div className="messages-head">
              <p>Inbox</p>

              <h1>
                {isProvider ? "Owner messages" : "Owner contacts"}
              </h1>

              <div className="messages-subtitle">
                Keep all rider-provider conversations for each property
                in one place.
              </div>
            </div>

            <div className="messages-list">
              {inboxConversations.length === 0 ? (
                <div className="messages-empty">
                  No conversations yet. Open a property page and use
                  the contact owner button to start one.
                </div>
              ) : (
                inboxConversations.map((conversation) => (
                  <Link
                    to={`/messages/${conversation._id}`}
                    key={conversation._id}
                    className={`messages-list-item ${
                      activeConversation?._id === conversation._id
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="d-flex justify-content-between gap-2">
                      <div className="messages-panel-title">
                        <strong>
                          {isProvider
                            ? conversation.rider?.name
                            : conversation.provider?.name}
                        </strong>

                        <span>
                          {conversation.property?.name}
                        </span>
                      </div>

                      {((!isProvider &&
                        conversation.unreadForRider > 0) ||
                        (isProvider &&
                          conversation.unreadForProvider > 0)) && (
                        <span className="messages-pill">
                          {isProvider
                            ? conversation.unreadForProvider
                            : conversation.unreadForRider}
                        </span>
                      )}
                    </div>

                    <p>
                      {conversation.messages?.length
                        ? conversation.messages[
                            conversation.messages.length - 1
                          ]?.content
                        : "No messages yet. Start the conversation."}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </aside>

          {/* Thread */}
          <section className="messages-card messages-thread">

            {!activeConversation ? (
              <div className="messages-head">
                <p>Conversation</p>

                <h2>No conversation selected</h2>

                <div className="messages-subtitle">
                  Choose an existing thread from the left,
                  or start one from any property page.
                </div>
              </div>
            ) : (
              <>
                <div className="messages-head">
                  <p>Conversation</p>

                  <h2>{activeProperty?.name}</h2>

                  <div className="messages-subtitle">
                    Chat directly with {activeContact?.name} about this
                    property and use the details below for quick follow-up.
                  </div>
                </div>

                <div className="messages-thread-body">

                  {/* Contact Grid */}
                  <div className="messages-contact-grid">

                    <div className="messages-contact-card">
                      <span>
                        {isProvider ? "Rider" : "Property owner"}
                      </span>

                      <strong>{activeContact?.name}</strong>
                    </div>

                    <div className="messages-contact-card">
                      <span>Phone Number</span>

                      <strong>
                        {activeContact?.phone ? (
                          <a href={`tel:+91${activeContact.phone}`}>
                            +91 {activeContact.phone}
                          </a>
                        ) : (
                          "Phone number not added yet"
                        )}
                      </strong>
                    </div>

                    <div className="messages-contact-card">
                      <span>Email</span>

                      <strong>
                        <a href={`mailto:${activeContact?.email}`}>
                          {activeContact?.email}
                        </a>
                      </strong>
                    </div>

                    <div className="messages-contact-card">
                      <span>Property</span>

                      <strong>
                        {activeProperty?.name}
                      </strong>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="message-stream">
                    {activeConversation.messages?.length === 0 ? (
                      <div className="messages-empty">
                        No messages yet. Send the first message below.
                      </div>
                    ) : (
                      activeConversation.messages.map((message, index) => (
                        <div
                          key={index}
                          className={`message-bubble ${
                            message.senderRole === (user?.role || currentRole)
                              ? "self"
                              : "other"
                          }`}
                        >
                          <small>
                            {message.senderName} •{" "}
                            {new Date(
                              message.createdAt
                            ).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </small>

                          <p>{message.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Compose */}
                  <form
                    className="messages-compose"
                    onSubmit={handleSendMessage}
                  >

                    <label
                      className="form-label"
                      htmlFor="message-content"
                    >
                      Send a message
                    </label>

                    <textarea
                      id="message-content"
                      name="content"
                      value={messageContent}
                      onChange={(event) =>
                        setMessageContent(event.target.value)
                      }
                      minLength={2}
                      maxLength={1500}
                      placeholder="Write your message here..."
                      required
                    />

                    <div className="messages-compose-actions">
                      <span className="messages-subtitle mb-0">
                        {sendStatus ||
                          "Messages stay grouped by property so follow-ups remain organized."}
                      </span>

                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={messageContent.trim().length < 2}
                      >
                        Send Message
                      </button>
                    </div>
                  </form>

                </div>
              </>
            )}

          </section>
        </div>
      </div>
    </section>
  );
};

export default MessagesInbox;
