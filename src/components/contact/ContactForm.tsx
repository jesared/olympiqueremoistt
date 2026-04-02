"use client";

import { useMemo, useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Contact ORTT");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = useMemo(() => EMAIL_REGEX.test(email.trim()), [email]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setError("Merci de remplir tous les champs.");
      return;
    }

    if (!isValidEmail) {
      setError("Merci de saisir une adresse email valide.");
      return;
    }

    setError(null);

    const bodyLines = [
      `Nom : ${trimmedName}`,
      `Email : ${trimmedEmail}`,
      "",
      trimmedMessage,
    ];

    const mailto = `mailto:contact@ortt.fr?subject=${encodeURIComponent(
      subject.trim() || "Contact ORTT",
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    window.location.href = mailto;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nom
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Votre nom"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          placeholder="vous@exemple.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Objet
        </label>
        <Input
          id="subject"
          name="subject"
          placeholder="Contact ORTT"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Votre message..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-[140px]"
          required
        />
      </div>

      {error ? (
        <p className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full">
        Envoyer
      </Button>
    </form>
  );
}
