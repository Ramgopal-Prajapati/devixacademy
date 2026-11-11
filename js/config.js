/**
 * DeviX Academy - Central Site Configuration
 * --------------------------------------------------------------------------
 * Update Web3Forms, WhatsApp, Email, Social URLs, and Site Metadata here.
 * No private secrets or API keys should ever be hardcoded elsewhere.
 */

window.DEVIX_CONFIG = Object.freeze({
  brandName: "DeviX Academy",
  tagline: "Learn. Build. Innovate. Lead.",
  founderName: "Ramgopal Prajapati",
  founderAlias: "Ram Sir",
  handle: "@iamramsir",
  city: "Indore",
  region: "Madhya Pradesh, India",

  // ------------------------------------------------------------------------
  // Web3Forms Configuration
  // Replace "YOUR_WEB3FORMS_ACCESS_KEY" with your public Web3Forms Access Key
  // obtained from https://web3forms.com/ (recipient email is configured inside
  // your Web3Forms dashboard).
  // ------------------------------------------------------------------------
  web3forms: {
    endpoint: "https://api.web3forms.com/submit",
    accessKey: "00329d5c-272b-49a1-9dd6-66f0b05b6584",
    fromName: "DeviX Academy Website"
  },

  // ------------------------------------------------------------------------
  // WhatsApp Integration
  // Local number: 9753528324 -> International E.164 format (India +91): 919753528324
  // ------------------------------------------------------------------------
  whatsapp: {
    displayNumber: "+91 97535 28324",
    rawNumber: "919753528324",
    defaultMessage:
      "Hello DeviX Academy, I want to know about your technology and AI training programs."
  },

  // ------------------------------------------------------------------------
  // Official Academy & Contact Channels
  // ------------------------------------------------------------------------
  contact: {
    email: "ramsirdevix@gmail.com",
    corporateEmail: "ramsirdevix@gmail.com",
    phoneDisplay: "+91 97535 28324",
    address: "Indore, Madhya Pradesh, India • Live Online Cohorts",
    hours: "Mon - Sat | 9:30 AM - 7:30 PM IST",
    websiteCanonicalBase: "https://devixacademy.example"
  },

  social: {
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/ramgopal-prajapati",
    reviews: "https://ramgopal-prajapati.github.io/mreviews/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/"
  }
});
