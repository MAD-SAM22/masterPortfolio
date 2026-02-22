/* Change this file to get your personal Porfolio */

// Website related settings
const settings = {
  isSplash: true, // Change this to false if you don't want Splash screen.
};

//SEO Related settings
const seo = {
  title: "Osama Hosam's Portfolio",
  description:
    "A passionate individual who always thrives to work on end to end products which develop sustainable and scalable social and technical systems to create impact.",
  og: {
    title: "Osama Hosam Portfolio",
    type: "website",
    url: "http://osamahosamabdellatif.com/",
  },
};

//Home Page
const greeting = {
  title: "Osama Hosam",
  logo_name: "Osama Hosam",
  nickname: "osama_hosam_abdellatif",
  subTitle:
    "A passionate individual who always thrives to work on end to end products which develop sustainable and scalable social and technical systems to create impact.",
  resumeLink:
    "https://1drv.ms/b/c/e714e11aff20c0aa/IQDKMZ44igTNSb8kqOgJXWCNAcU2Kk3Gmd0Cqrq_gBVBnIM?e=a2ihc3",
  portfolio_repository: "https://github.com/MAD-SAM22/masterPortfolio",
  githubProfile: "https://github.com/MAD-SAM22",
};

const socialMediaLinks = [
  /* Your Social Media Link */
  // github: "https://github.com/ashutosh1919",
  // linkedin: "https://www.linkedin.com/in/ashutosh-hathidara-88710b138/",
  // gmail: "ashutoshhathidara98@gmail.com",
  // gitlab: "https://gitlab.com/ashutoshhathidara98",
  // facebook: "https://www.facebook.com/laymanbrother.19/",
  // twitter: "https://twitter.com/ashutosh_1919",
  // instagram: "https://www.instagram.com/layman_brother/"

  {
    name: "Github",
    link: "https://github.com/MAD-SAM22",
    fontAwesomeIcon: "fa-github", // Reference https://fontawesome.com/icons/github?style=brands
    backgroundColor: "#181717", // Reference https://simpleicons.org/?q=github
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/in/osama-hosam-abdellatif-720425292/",
    fontAwesomeIcon: "fa-linkedin-in", // Reference https://fontawesome.com/icons/linkedin-in?style=brands
    backgroundColor: "#0077B5", // Reference https://simpleicons.org/?q=linkedin
  },
  {
    name: "YouTube",
    link: "https://youtube.com/c/DevSense19",
    fontAwesomeIcon: "fa-youtube", // Reference https://fontawesome.com/icons/youtube?style=brands
    backgroundColor: "#FF0000", // Reference https://simpleicons.org/?q=youtube
  },
  {
    name: "Hotmail",
    link: "mailto:osama.abdellatif.official@hotmail.com",
    fontAwesomeIcon: "fa-at", // Reference https://fontawesome.com/icons/google?style=brands
    backgroundColor: "#D14836", // Reference https://simpleicons.org/?q=gmail
  },
  {
    name: "X-Twitter",
    link: "https://x.com/yourfavossama?s=21&t=c6yAD3ZWBMRr6guL2FX7qQ",
    fontAwesomeIcon: "fa-x-twitter", // Reference https://fontawesome.com/icons/x-twitter?f=brands&s=solid
    backgroundColor: "#000000", // Reference https://simpleicons.org/?q=x
  },
  // {
  //   name: "Facebook",
  //   link: "https://www.facebook.com/laymanbrother.19/",
  //   fontAwesomeIcon: "fa-facebook-f", // Reference https://fontawesome.com/icons/facebook-f?style=brands
  //   backgroundColor: "#1877F2", // Reference https://simpleicons.org/?q=facebook
  // },
  // {
  //   name: "Instagram",
  //   link: "https://www.instagram.com/layman_brother/",
  //   fontAwesomeIcon: "fa-instagram", // Reference https://fontawesome.com/icons/instagram?style=brands
  //   backgroundColor: "#E4405F", // Reference https://simpleicons.org/?q=instagram
  // },
];

const skills = {
  data: [
    {
      title: "Full Stack Development",
      fileName: "FullStackImg",
      skills: [
        "⚡ Building responsive website front end using React-Redux",
        "⚡ Creating application backend in Node, Express & Flask",
      ],
      softwareSkills: [
        {
          skillName: "Laravel",
          fontAwesomeClassname: "simple-icons:laravel",
          style: {
            color: "#E34F26",
          },
        },
        {
          skillName: "Tailwind CSS",
          fontAwesomeClassname: "simple-icons:tailwindcss",
          style: {
            color: "#1572B6",
          },
        },
        {
          skillName: "JavaScript",
          fontAwesomeClassname: "simple-icons:javascript",
          style: {
            backgroundColor: "#000000",
            color: "#F7DF1E",
          },
        },
        {
          skillName: "ReactJS",
          fontAwesomeClassname: "simple-icons:react",
          style: {
            color: "#61DAFB",
          },
        },
        {
          skillName: "NodeJS",
          fontAwesomeClassname: "devicon-plain:nodejs-wordmark",
          style: {
            color: "#339933",
          },
        },
        {
          skillName: "Next.js",
          fontAwesomeClassname: "simple-icons:nextdotjs",
          style: {
            color: "#000000",
          },
        },
        {
          skillName: "NPM",
          fontAwesomeClassname: "simple-icons:npm",
          style: {
            color: "#CB3837",
          },
        },
        {
          skillName: "Yarn",
          fontAwesomeClassname: "simple-icons:yarn",
          style: {
            color: "#2C8EBB",
          },
        },
        {
          skillName: "Gatsby",
          fontAwesomeClassname: "simple-icons:gatsby",
          style: {
            color: "#663399",
          },
        },
      ],
    },
    {
      title: "Mobile Development ",
      fileName: "MobileDevImg",
      skills: [
        "⚡ Building cross-platform mobile apps using Flutter",
        "⚡ Developing native Android apps with Kotlin/Java",
        "⚡ Developing native iOS apps with Swift/Objective-C",
        "⚡ Integrating REST APIs, Firebase, and real-time databases",
        "⚡ Publishing apps to Google Play Store and Apple App Store",
      ],
      softwareSkills: [
        {
          skillName: "Flutter",
          fontAwesomeClassname: "simple-icons:flutter",
          style: {
            color: "#02569B",
          },
        },
        {
          skillName: "Dart",
          fontAwesomeClassname: "simple-icons:dart",
          style: {
            color: "#0175C2",
          },
        },
        //         {
        //   skillName: "React Native",
        //   fontAwesomeClassname: "simple-icons:react",
        //   style: {
        //     color: "#61DAFB",
        //   },
        // },
        {
          skillName: "Android",
          fontAwesomeClassname: "simple-icons:android",
          style: {
            color: "#3DDC84",
          },
        },
        // {
        //   skillName: "Java",
        //   fontAwesomeClassname: "simple-icons:java",
        //   style: {
        //     color: "#007396",
        //   },
        // },
        {
          skillName: "Kotlin",
          fontAwesomeClassname: "simple-icons:kotlin",
          style: {
            color: "#7F52FF",
          },
        },

        {
          skillName: "iOS",
          fontAwesomeClassname: "simple-icons:apple",
          style: {
            color: "#000000",
          },
        },
        {
          skillName: "Swift",
          fontAwesomeClassname: "simple-icons:swift",
          style: {
            color: "#FA7343",
          },
        },
        {
          skillName: "Firebase",
          fontAwesomeClassname: "simple-icons:firebase",
          style: {
            color: "#FFCA28",
          },
        },
      ],
    },

    {
      title: "Data Science & AI",
      fileName: "DataScienceImg",
      skills: [
        "⚡ Developing highly scalable production ready models for various deeplearning and statistical use cases",
        "⚡ Experience of working with Computer Vision and NLP projects",
        "⚡ Complex quantitative modelling for dynamic forecasting and time series analysis",
      ],
      softwareSkills: [
        {
          skillName: "Tensorflow",
          fontAwesomeClassname: "logos-tensorflow",
          style: {
            backgroundColor: "transparent",
          },
        },
        {
          skillName: "Keras",
          fontAwesomeClassname: "simple-icons:keras",
          style: {
            backgroundColor: "white",
            color: "#D00000",
          },
        },
        {
          skillName: "PyTorch",
          fontAwesomeClassname: "logos-pytorch",
          style: {
            backgroundColor: "transparent",
          },
        },
        {
          skillName: "Python",
          fontAwesomeClassname: "ion-logo-python",
          style: {
            backgroundColor: "transparent",
            color: "#3776AB",
          },
        },
        {
          skillName: "Deeplearning",
          imageSrc: "deeplearning_ai_logo.png",
        },
      ],
    },

    {
      title: "UI/UX Design",
      fileName: "DesignImg",
      skills: [
        "⚡ Designing highly attractive user interface for mobile and web applications",
        "⚡ Creating the flow of application functionalities to optimize user experience",
      ],
      softwareSkills: [
        {
          skillName: "Adobe XD",
          fontAwesomeClassname: "simple-icons:adobexd",
          style: {
            color: "#FF2BC2",
          },
        },
        {
          skillName: "Figma",
          fontAwesomeClassname: "simple-icons:figma",
          style: {
            color: "#F24E1E",
          },
        },
        // {
        //   skillName: "Adobe Illustrator",
        //   fontAwesomeClassname: "simple-icons:adobeillustrator",
        //   style: {
        //     color: "#FF7C00",
        //   },
        // },
        {
          skillName: "Canva",
          fontAwesomeClassname: "simple-icons:canva",
          style: {
            color: "#3969E7",
          },
        },
      ],
    },
  ],
};

// Education Page
const competitiveSites = {
  competitiveSites: [
    {
      siteName: "LeetCode",
      iconifyClassname: "simple-icons:leetcode",
      style: {
        color: "#F79F1B",
      },
      profileLink: "https://leetcode.com/u/MAD-SAM22/",
    },
    {
      siteName: "HackerRank",
      iconifyClassname: "simple-icons:hackerrank",
      style: {
        color: "#2EC866",
      },
      profileLink: "https://www.hackerrank.com/profile/osama_abdellati2",
    },
    {
      siteName: "Android",
      iconifyClassname: "simple-icons:android",
      style: {
        color: "green",
      },
      profileLink: "https://developers.google.com/profile/u/OsamaAbdellatif",
    },
    {
      siteName: "Kaggle",
      iconifyClassname: "simple-icons:kaggle",
      style: {
        color: "#20BEFF",
      },
      profileLink: "https://www.kaggle.com/osamahosamabdellatif",
    },
  ],
};

const degrees = {
  degrees: [
    {
      title: "Information Technology Institute",
      subtitle: "Diploma in Native Mobile Development",
      logo_path: "iti_logo.png",
      alt_name: "ITI",
      duration: "2025 - 2026",
      descriptions: [
        "⚡ Completed a specialized diploma in native mobile application development for Android and iOS platforms.",
        "⚡ Hands-on experience in native Android (Kotlin, Java) and iOS (Swift, Objective-C) mobile development.",
      ],
      website_link: "https://iti.gov.eg/",
    },
    {
      title: "October University for Modern Sciences and Arts",
      subtitle: "B.Tech. in Computer Science (major of software engineering)",
      logo_path: "MSA_Logo.png",
      alt_name: "October University for Modern Sciences and Arts",
      duration: "2021 - 2025",
      descriptions: [
        "⚡ I have studied basic software engineering subjects like DS, Algorithms, DBMS, OS, CA, AI etc.",
        "⚡ Apart from this, I have done courses on Deep Learning, Data Science, Cloud Computing , Cross Platform and Full Stack Development.",
        "⚡ Participated in annual Best Project competitions and consistently ranked among the top 10 graduation projects across the university.",
      ],
      website_link: "https://msa.edu.eg/msauniversity/",
    },
    {
      title: "University of Greenwich",
      subtitle: "B.Tech. in Computer Science",
      logo_path: "Greenwich-LOGO.png",
      alt_name: "University of Greenwich",
      duration: "2021 - 2025",
      descriptions: [
        "⚡ Enrolled in a B.Tech dual degree program where the curriculum, course content, and examinations were fully aligned with the academic standards of Greenwich University and MSA.",
        // "⚡ Studied core computer science and engineering subjects including programming, data structures, algorithms, databases, operating systems, AI , and Machine Learning.",
        "⚡ Completed coursework and assessments designed to meet international academic requirements and ensure consistency across both institutions .",
      ],
      website_link: "https://www.gre.ac.uk/",
    },
  ],
};

const certifications = {
  certifications: [
    {
      title: "Django Framework",
      subtitle: "- ITI ",
      logo_path: "iti_logo.png",
      certificate_link:
        "https://1drv.ms/i/c/e714e11aff20c0aa/IQBvLLWQ0H4OT7-Uskcm1FMAAeQBLVsy3N5TZzYvLHyrmao?e=cm6r0w",
      alt_name: "ITI Django Framework",
      color_code: "#8C151599",
    },
    {
      title: "Data Fundamentals",
      subtitle: "- Microsoft Azure",
      logo_path: "microsoft_logo.png",
      certificate_link:
        "https://www.credly.com/badges/fcb84c50-19d6-40a2-b895-5b77cc14d312",
      alt_name: "Microsoft Azure",
      color_code: "#D83B0199",
    },
    {
      title: "AI Fundamentals",
      subtitle: "- Microsoft Azure",
      logo_path: "microsoft_logo.png",
      certificate_link:
        "https://www.credly.com/badges/823e0a7a-e549-420e-9aa0-7ab477d4a54c",
      alt_name: "Microsoft Azure",
      color_code: "#0C9D5899",
    },
    {
      title: "Conference Speaker",
      subtitle: "- Birmingham City University",
      logo_path: "birmingham_city_university.png",
      certificate_link:
        "https://1drv.ms/i/c/e714e11aff20c0aa/IQB89aYLLiMBTayk44tsZRfHAdwOKC6XZylHwfQCkpk8Ggg?e=1vHWsC",
      alt_name: "Birmingham City University",
      color_code: "#0e1947",
    },
    {
      title: "Competitive Programming ",
      subtitle: "- ICPC",
      logo_path: "icpc-logo.png",
      certificate_link:
        "https://1drv.ms/b/c/e714e11aff20c0aa/IQA5CCJWRebHTrrkf4pdit2gAcWfOEsQk2Z4rsPMmsOeb_8?e=6siheq",
      alt_name: "ICPC",
      color_code: "white",
    },
    {
      title: "Deep Minds Event Completion",
      subtitle: "- MSA University",
      logo_path: "deep-mind.jpg",
      certificate_link:
        "https://1drv.ms/b/c/e714e11aff20c0aa/IQBHYrmICQI9RI7llGRP8HlZAafsT3Ri5Zy34pMKfUSMrmU?e=ybf2Pn",
      alt_name: "Deep Minds",
      color_code: "#7c5f41",
    },
    {
      title: "Smart Universities Hackathon Competition",
      subtitle: "- MSA University",
      logo_path: "hackathon_logo.jpg",
      certificate_link:
        "https://1drv.ms/b/c/e714e11aff20c0aa/IQAACGhE0b0OSJ4zyBGEULPuAWkGcIVqAGWJKn1J7sdzHFA?e=l2asVh",
      alt_name: "HACKATHON",
      color_code: "#0e1947",
    },
  ],
};

// Experience Page
const experience = {
  title: "Experience",
  subtitle: "Work, Internship and Volunteership",
  description:
    "I have worked with many evolving startups as ML and DL Developer, Designer and Software Architect. I have also worked with some well established companies mostly as AI Developer. I love organising events and that is why I am also involved with many opensource communities as a representative.",
  header_image_path: "experience.svg",
  sections: [
    {
      title: "Work",
      work: true,
      experiences: [
        {
          title: "Web Developer",
          company: "AiTech",
          company_url: "https://aitech.net.au/",
          logo_path: "aitech_logo2.png",
          duration: "Oct 2024 - Feb 2025",
          location: "6th of October City, Cairo, Egypt",
          description:
            "Followed the full software development life cycle (SDLC) to develop web applications using Laravel and the MERN stack. Built and tested multiple systems, including Kuttab and Basaeer, ensuring functionality, performance, and reliability of the deployed applications.",
          color: "#000000",
        },
        {
          title: "AI Engineer",
          company: "AiTech",
          company_url: "https://aitech.net.au/",
          logo_path: "aitech_logo2.png",
          duration: "May 2025 - July 2025",
          location: "6th of October City, Cairo, Egypt",
          description:
            "Contributed to developing AI agents responsible for scraping candidate data, extracting and analyzing CVs, and ranking potential hires to streamline recruitment. Assisted in implementing AI-driven interview systems to evaluate candidates and support data-driven hiring decisions.",
          color: "#000000",
        },
        {
          title: "Software Engineer",
          company: "Roomerit",
          company_url: "https://roomerit.com/",
          logo_path: "roomerit_logo.png",
          duration: "Sep 2025 - Jan 2026",
          location: "Saudi Arabia(remote)",
          description:
            "Part of the development team for Roomerit’s full SaaS smart hotel management system, building modules for Superadmin, Admin, Staff, and Clients. Contributed to backend and frontend features, integrated core functionalities for hotel operations, bookings, and user management, and worked on deploying and maintaining the system on cloud infrastructure to ensure scalability and reliability.",
          color: "#000000",
        },
      ],
    },
    {
      title: "Internships",
      experiences: [
        {
          title: "Python and Django Web Developer Intern",
          company: "Information Technology Institute",
          company_url: "https://www.iti.gov.eg/",
          logo_path: "iti_logo.png",
          duration: "Aug 2024 - Sept 2024",
          location: "Remote, Egypt",
          description:
            "Completed a 120-hour internship as a Python and Django web developer. Gained hands-on experience in building web applications using Python, Django, CSS, and RESTful APIs. Developed backend logic, integrated databases, and created dynamic web pages, applying modern web development practices to deliver functional web solutions.",
          color: "#ee3c26",
        },
        {
          title: "Java Backend Developer Intern",
          company: "Orange Egypt",
          company_url: "https://www.orange.eg/en/",
          logo_path: "orange_logo.png",
          duration: "Sept 2024 - Oct 2024",
          location: "Smart Village, Cairo, Egypt",
          description:
            "Interned as a Java Backend Developer, learning web development using Spring Boot and Java. Contributed to the development of a real promotion engine for Orange’s telecom services, building backend features, implementing business logic, and collaborating on a production-grade system to manage promotional campaigns.",
          color: "#000000",
        },
      ],
    },
    {
      title: "Volunteerships",
      experiences: [
        {
          title: "TEDx Organizer",
          company: "TEDx",
          company_url:
            "https://msa.edu.eg/msauniversity/campus/student-clubs/tedx-msa/",
          logo_path: "tedx-logo.png",
          duration: "",
          location: "MSA University",
          description:
            "Actively serving as an organizer for TEDx at MSA University, responsible for planning and coordinating events, managing logistics, and supporting speakers. Collaborate with team members to promote events, engage the student community, and ensure smooth execution of talks and activities, fostering an inspiring environment for knowledge sharing and innovation.",
          color: "#181717",
        },
        {
          title: "delegate of Japan security council",
          company: "Mock United Nations(MUN)",
          company_url:
            "https://archive.msa.edu.eg/student-life/student-activities-clubs/mun",
          logo_path: "mun-logo.png",
          duration: "",
          location: "MSA University",
          description:
            "Served as a delegate representing Japan in the Security Council at MSA Model United Nations (MSAMUN). Participated in sessions simulating UN proceedings, engaged in debates on international issues, collaborated with fellow delegates to draft resolutions, and honed diplomacy, negotiation, and public speaking skills.",
          color: "#000000",
        },
        {
          title: "Sales and Marketing Volunteer",
          company: "Titans",
          company_url:
            "https://msa.edu.eg/msauniversity/campus/student-clubs/titans/",
          logo_path: "titans_logo.jpg",
          duration: "",
          location: "MSA University",
          description:
            "Served as a Sales and Marketing member for Titans, a fitness club at MSA University. Promoted club activities and events, engaged with students to increase participation, and contacted influencers to expand the club’s reach. Collaborated with partners like Gravity Code Games and Arkade Games to integrate entertainment into events, enhancing student engagement and outreach.",
          color: "#4285F4",
        },
        {
          title: "Food preparing volunteer",
          company: "Lebaladna",
          company_url: "https://www.lebaladna.org/",
          logo_path: "lebaladna_logo.png",
          duration: "",
          location: "Cairo, Egypt",
          description:
            "Volunteered in preparing and distributing 5,000 food cartons for underprivileged families before Ramadan, supporting the Lebaladna Foundation led by Dr. Nawal El-Degwi, and assisting with organization, coordination, and timely delivery.",
          color: "#0C9D58",
        },
        {
          title: "Orphaned children Event Organizer volunteer",
          company: "Alwan Team",
          company_url: "https://www.facebook.com/AlwanTeamEG/",
          logo_path: "alwan_team_logo.jpg",
          duration: "",
          location: "Kafr-Elshiekh, Egypt",
          description:
            "Volunteered as an event organizer for activities supporting orphaned children, contributing to planning, coordination, and execution of charitable events. Collaborated with team members to manage logistics, engage volunteers, and create meaningful social and recreational experiences for children.",
          color: "#0C9D58",
        },
      ],
    },
  ],
};

// Projects Page
const projectsHeader = {
  title: "Projects",
  description:
    "My projects makes use of vast variety of latest technology tools. My best experience is to create Data Science projects and deploy them to web applications using cloud infrastructure.",
  avatar_image_path: "projects_image.svg",
};

const publicationsHeader = {
  title: "Publications",
  description: "Some of my published Articles, Blogs and Research.",
  avatar_image_path: "projects_image.svg",
};

const publications = {
  data: [
    {
      id: "IMenu",
      name:
        "IMenu: A Smart Table Interface Combining TUIs, Gestures, AR, Eye-Gaze, and Emotion Recognition",
      createdAt: "2025-10-01T00:00:00Z",
      description:
        "published In Conference: 2025 7th Novel Intelligent and Leading Emerging Sciences Conference (NILES)",
      url:
        "https://www.researchgate.net/publication/397635702_IMenu_A_Smart_Table_Interface_Combining_TUIs_Gestures_AR_Eye-Gaze_and_Emotion_Recognition",
    },
    {
      id: "LLM-Ops-and-Ensemble-Intelligence",
      name:
        "LLM-Ops and Ensemble Intelligence for Robust LLM Performance: Integrating Fine-Tuning and Majority Voting",
      createdAt: "2025-10-01T00:00:00Z",
      description:
        "published In Conference: 2025 IEEE/ACS 22nd International Conference on Computer Systems and Applications (AICCSA)",
      url:
        "https://www.researchgate.net/publication/399468850_LLM-Ops_and_Ensemble_Intelligence_for_Robust_LLM_Performance_Integrating_Fine-Tuning_and_Majority_Voting",
    },
    {
      id: "LLMOps-Driven",
      name: "LLMOps-Driven Robotic Process Automation Approach",
      createdAt: "2025-05-01T00:00:00Z",
      description:
        "published In Conference: 2025 Intelligent Methods, Systems, and Applications (IMSA)",
      url:
        "https://www.researchgate.net/publication/395825464_LLMOps-Driven_Robotic_Process_Automation_Approach",
    },
    {
      id: "LMV-RPA",
      name: "LMV-RPA: Large Model Voting-Based Robotic Process Automation",
      createdAt: "2025-06-12T00:00:00Z",
      description:
        "published In book: Advances on Intelligent Computing and Data Science II",
      url:
        "https://www.researchgate.net/publication/393017533_LMV-RPA_Large_Model_Voting-Based_Robotic_Process_Automation",
    },
    {
      id: "LMRPA",
      name:
        "LMRPA: Large Language Model-Driven Efficient Robotic Process Automation for OCR",
      createdAt: "2025-07-12T00:00:00Z",
      description:
        "published In book: Advances on Intelligent Computing and Data Science II",
      url:
        "https://www.researchgate.net/publication/393904765_LMRPA_Large_Language_Model-Driven_Efficient_Robotic_Process_Automation_for_OCR",
    },
    {
      id: "ERPA",
      name:
        "ERPA: Efficient RPA Model Integrating OCR and LLMs for Intelligent Document Processing",
      createdAt: "2025-11-05T00:00:00Z",
      description:
        "published In Conference: 2024 International Mobile, Intelligent, and Ubiquitous Computing Conference (MIUCC)",
      url:
        "https://www.researchgate.net/publication/387120805_ERPA_Efficient_RPA_Model_Integrating_OCR_and_LLMs_for_Intelligent_Document_Processing",
    },
  ],
};

// Contact Page
const contactPageData = {
  contactSection: {
    title: "Contact Me",
    profile_image_path: "osama_img.jpg",
    description:
      "I am available on almost every social media. You can message me, I will reply within 24 hours. I can help you with ML, AI, React, Android, Cloud and Opensource Development.",
  },
  blogSection: {
    title: "Blogs",
    subtitle:
      "I like to document some of my experiences in professional career journey as well as some technical knowledge sharing.",
    link: "https://blogs.ashutoshhathidara.com/",
    avatar_image_path: "blogs_image.svg",
  },
  addressSection: {
    title: "Address",
    subtitle: "Saratoga Ave, San Jose, CA, USA 95129",
    locality: "San Jose",
    country: "USA",
    region: "California",
    postalCode: "95129",
    streetAddress: "Saratoga Avenue",
    avatar_image_path: "address_image.svg",
    location_map_link: "https://maps.app.goo.gl/NvYZqa34Wye4tpS17",
  },
  phoneSection: {
    title: "",
    subtitle: "",
  },
};

export {
  settings,
  seo,
  greeting,
  socialMediaLinks,
  skills,
  competitiveSites,
  degrees,
  certifications,
  experience,
  projectsHeader,
  publicationsHeader,
  publications,
  contactPageData,
};
