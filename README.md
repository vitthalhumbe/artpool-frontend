# ArtPool (Frontend)

welcome to the client side (frontend) of ArtPool, This is where artists showcases their work, and customer can see & buy their work.


# Small Details 
This project is built with React (Vite) and focuses on UI/UX and mainly smooth animations. 

What has been done :
- Two-face profile : The UI adapts automatically, It doesn't asks you to choose your role while login, it searches your role automatically. If you are artists you are allowed to add your work, view your stats, etc. If you are customer you are allowed to hire the artist, buy the artpiece, etc.

- Gallery : Pinterest Style feed that showcases the all the works of all artists who are joined the platform.

- Live Interation : Likes and view of each artwork can be seen in action in real time.


# Tech Stack

- **core** : React.js + VITE
- **style** : Tailwind CSS
- **Animations** : Framer Motion
- **Icons** : Lucide Icons
- **Data** : Axios


# how to run it ?

Note : you need `Node.js` installed and artpool backend running.

1. Clone the repo
```bash
git clone https://github.com/vitthalhumbe/artpool-frontend.git
cd artpool-frontend
```

2. Install the Packages
```bash
npm install
```

3. Setup the environment
Create a `.env` file in the root folder. 

```bash
VITE_CLOUD_NAME=your-cloud-name
VITE_UPLOAD_PRESET=your-upload-preset
```

4. Start the development engine
```bash
npm run dev
```

Open Your browser to `http://localhost:5713` (Vite can provide different port number)


# What's Completed and Remaining ?

1. Done    : Authentication (Login/Signup)
2. DOne    : User profile (Edit bio, avatar, Banner)
3. Done    : Gallery System (Upload, view, delete, like)
4. Pending : Home Feed
5. Pending : Commision Dashboard 


**Combines my Artistics and Engineering skills**