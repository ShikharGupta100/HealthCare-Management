const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
dotenv.config()

const User = require("./models/User.model")
const Doctor = require("./models/Doctor.models")

const doctors = [
    { name: "Dr. Arjun Sharma", email: "arjun@doctor.com", specialization: "Cardiology", qualification: "MBBS, MD", experience: 12, consultationFee: 800, city: "Delhi", availableDays: ["Monday", "Wednesday", "Friday"] },
    { name: "Dr. Priya Patel", email: "priya@doctor.com", specialization: "Dermatology", qualification: "MBBS, MD", experience: 8, consultationFee: 600, city: "Mumbai", availableDays: ["Tuesday", "Thursday"] },
    { name: "Dr. Rahul Verma", email: "rahul@doctor.com", specialization: "Neurology", qualification: "MBBS, DM", experience: 15, consultationFee: 1200, city: "Bangalore", availableDays: ["Monday", "Tuesday", "Friday"] },
    { name: "Dr. Sneha Gupta", email: "sneha@doctor.com", specialization: "Pediatrics", qualification: "MBBS, DCH", experience: 10, consultationFee: 500, city: "Chennai", availableDays: ["Monday", "Wednesday", "Saturday"] },
    { name: "Dr. Vikram Singh", email: "vikram@doctor.com", specialization: "Orthopedics", qualification: "MBBS, MS", experience: 14, consultationFee: 900, city: "Hyderabad", availableDays: ["Tuesday", "Thursday", "Saturday"] },
    { name: "Dr. Anita Reddy", email: "anita@doctor.com", specialization: "Gynecology", qualification: "MBBS, MS", experience: 11, consultationFee: 700, city: "Delhi", availableDays: ["Monday", "Wednesday", "Friday"] },
    { name: "Dr. Suresh Kumar", email: "suresh@doctor.com", specialization: "General Medicine", qualification: "MBBS, MD", experience: 9, consultationFee: 400, city: "Mumbai", availableDays: ["Monday", "Tuesday", "Wednesday"] },
    { name: "Dr. Deepa Nair", email: "deepa@doctor.com", specialization: "Ophthalmology", qualification: "MBBS, MS", experience: 7, consultationFee: 600, city: "Pune", availableDays: ["Tuesday", "Thursday", "Saturday"] },
    { name: "Dr. Rajesh Mehta", email: "rajesh@doctor.com", specialization: "ENT", qualification: "MBBS, MS", experience: 13, consultationFee: 700, city: "Ahmedabad", availableDays: ["Monday", "Wednesday", "Friday"] },
    { name: "Dr. Kavita Joshi", email: "kavita@doctor.com", specialization: "Psychiatry", qualification: "MBBS, MD", experience: 10, consultationFee: 900, city: "Bangalore", availableDays: ["Tuesday", "Thursday"] },
    { name: "Dr. Anil Kapoor", email: "anil@doctor.com", specialization: "Urology", qualification: "MBBS, MS", experience: 16, consultationFee: 1000, city: "Delhi", availableDays: ["Monday", "Wednesday", "Friday"] },
    { name: "Dr. Meena Iyer", email: "meena@doctor.com", specialization: "Endocrinology", qualification: "MBBS, DM", experience: 12, consultationFee: 1100, city: "Chennai", availableDays: ["Tuesday", "Thursday", "Saturday"] },
    { name: "Dr. Sanjay Rao", email: "sanjay@doctor.com", specialization: "Gastroenterology", qualification: "MBBS, DM", experience: 14, consultationFee: 1000, city: "Hyderabad", availableDays: ["Monday", "Tuesday", "Friday"] },
    { name: "Dr. Pooja Sharma", email: "pooja@doctor.com", specialization: "Rheumatology", qualification: "MBBS, MD", experience: 9, consultationFee: 800, city: "Mumbai", availableDays: ["Wednesday", "Thursday", "Saturday"] },
    { name: "Dr. Amit Jain", email: "amit@doctor.com", specialization: "Pulmonology", qualification: "MBBS, MD", experience: 11, consultationFee: 900, city: "Pune", availableDays: ["Monday", "Wednesday", "Friday"] },
    { name: "Dr. Ritu Agarwal", email: "ritu@doctor.com", specialization: "Nephrology", qualification: "MBBS, DM", experience: 13, consultationFee: 1100, city: "Delhi", availableDays: ["Tuesday", "Thursday"] },
    { name: "Dr. Kiran Reddy", email: "kiran@doctor.com", specialization: "Oncology", qualification: "MBBS, MD, DM", experience: 18, consultationFee: 1500, city: "Bangalore", availableDays: ["Monday", "Wednesday", "Friday"] },
    { name: "Dr. Manoj Tiwari", email: "manoj@doctor.com", specialization: "Cardiology", qualification: "MBBS, DM", experience: 20, consultationFee: 1500, city: "Mumbai", availableDays: ["Tuesday", "Thursday", "Saturday"] },
    { name: "Dr. Sunita Pillai", email: "sunita@doctor.com", specialization: "Dermatology", qualification: "MBBS, DVD", experience: 6, consultationFee: 500, city: "Kochi", availableDays: ["Monday", "Wednesday", "Saturday"] },
    { name: "Dr. Prasad Kulkarni", email: "prasad@doctor.com", specialization: "Neurology", qualification: "MBBS, MD", experience: 10, consultationFee: 1000, city: "Pune", availableDays: ["Monday", "Tuesday", "Thursday"] },
    { name: "Dr. Geeta Menon", email: "geeta@doctor.com", specialization: "Pediatrics", qualification: "MBBS, MD", experience: 15, consultationFee: 600, city: "Chennai", availableDays: ["Tuesday", "Wednesday", "Friday"] },
    { name: "Dr. Harish Nanda", email: "harish@doctor.com", specialization: "Orthopedics", qualification: "MBBS, DNB", experience: 12, consultationFee: 850, city: "Delhi", availableDays: ["Monday", "Thursday", "Saturday"] },
    { name: "Dr. Lalitha Krishnan", email: "lalitha@doctor.com", specialization: "Gynecology", qualification: "MBBS, DGO", experience: 14, consultationFee: 750, city: "Hyderabad", availableDays: ["Tuesday", "Friday", "Saturday"] },
    { name: "Dr. Nikhil Desai", email: "nikhil@doctor.com", specialization: "General Medicine", qualification: "MBBS", experience: 5, consultationFee: 300, city: "Ahmedabad", availableDays: ["Monday", "Wednesday", "Friday"] },
    { name: "Dr. Shweta Bose", email: "shweta@doctor.com", specialization: "Ophthalmology", qualification: "MBBS, DO", experience: 8, consultationFee: 550, city: "Kolkata", availableDays: ["Tuesday", "Thursday", "Saturday"] },
    { name: "Dr. Venkat Subramaniam", email: "venkat@doctor.com", specialization: "ENT", qualification: "MBBS, DLO", experience: 11, consultationFee: 650, city: "Chennai", availableDays: ["Monday", "Wednesday", "Friday"] },
    { name: "Dr. Nandita Roy", email: "nandita@doctor.com", specialization: "Psychiatry", qualification: "MBBS, MD", experience: 9, consultationFee: 850, city: "Kolkata", availableDays: ["Tuesday", "Thursday"] },
    { name: "Dr. Sunil Malhotra", email: "sunil@doctor.com", specialization: "Urology", qualification: "MBBS, MCh", experience: 17, consultationFee: 1200, city: "Delhi", availableDays: ["Monday", "Wednesday", "Saturday"] },
    { name: "Dr. Indira Banerjee", email: "indira@doctor.com", specialization: "Endocrinology", qualification: "MBBS, MD", experience: 13, consultationFee: 1000, city: "Kolkata", availableDays: ["Tuesday", "Friday"] },
    { name: "Dr. Ramesh Choudhary", email: "ramesh@doctor.com", specialization: "Gastroenterology", qualification: "MBBS, MD", experience: 16, consultationFee: 950, city: "Jaipur", availableDays: ["Monday", "Wednesday", "Friday"] },
    { name: "Dr. Pallavi Saxena", email: "pallavi@doctor.com", specialization: "Rheumatology", qualification: "MBBS, MD", experience: 10, consultationFee: 750, city: "Lucknow", availableDays: ["Tuesday", "Thursday", "Saturday"] },
    { name: "Dr. Girish Patil", email: "girish@doctor.com", specialization: "Pulmonology", qualification: "MBBS, MD", experience: 12, consultationFee: 850, city: "Bangalore", availableDays: ["Monday", "Thursday", "Friday"] },
    { name: "Dr. Sudha Varma", email: "sudha@doctor.com", specialization: "Nephrology", qualification: "MBBS, DM", experience: 14, consultationFee: 1050, city: "Hyderabad", availableDays: ["Tuesday", "Wednesday", "Saturday"] },
    { name: "Dr. Tarun Bhatt", email: "tarun@doctor.com", specialization: "Oncology", qualification: "MBBS, MD", experience: 19, consultationFee: 1400, city: "Mumbai", availableDays: ["Monday", "Wednesday", "Friday"] },
    { name: "Dr. Rekha Pillai", email: "rekha@doctor.com", specialization: "Cardiology", qualification: "MBBS, MD", experience: 11, consultationFee: 950, city: "Kochi", availableDays: ["Tuesday", "Thursday", "Saturday"] },
    { name: "Dr. Ashok Mishra", email: "ashok@doctor.com", specialization: "Dermatology", qualification: "MBBS, MD", experience: 7, consultationFee: 550, city: "Varanasi", availableDays: ["Monday", "Wednesday", "Friday"] },
    { name: "Dr. Vandana Tripathi", email: "vandana@doctor.com", specialization: "Neurology", qualification: "MBBS, MD", experience: 9, consultationFee: 900, city: "Lucknow", availableDays: ["Tuesday", "Thursday"] },
    { name: "Dr. Mohan Das", email: "mohan@doctor.com", specialization: "Pediatrics", qualification: "MBBS, MD", experience: 13, consultationFee: 550, city: "Bhubaneswar", availableDays: ["Monday", "Wednesday", "Saturday"] },
    { name: "Dr. Chitra Narayanan", email: "chitra@doctor.com", specialization: "Orthopedics", qualification: "MBBS, MS", experience: 15, consultationFee: 950, city: "Chennai", availableDays: ["Tuesday", "Thursday", "Friday"] },
    { name: "Dr. Vivek Mathur", email: "vivek@doctor.com", specialization: "Gynecology", qualification: "MBBS, MD", experience: 10, consultationFee: 700, city: "Jaipur", availableDays: ["Monday", "Wednesday", "Friday"] },
    { name: "Dr. Anjali Srivastava", email: "anjali@doctor.com", specialization: "General Medicine", qualification: "MBBS", experience: 6, consultationFee: 350, city: "Agra", availableDays: ["Tuesday", "Thursday", "Saturday"] },
    { name: "Dr. Balasubramaniam K", email: "bala@doctor.com", specialization: "Ophthalmology", qualification: "MBBS, MS", experience: 11, consultationFee: 600, city: "Coimbatore", availableDays: ["Monday", "Wednesday", "Friday"] },
    { name: "Dr. Neelam Khanna", email: "neelam@doctor.com", specialization: "ENT", qualification: "MBBS, MS", experience: 8, consultationFee: 600, city: "Chandigarh", availableDays: ["Tuesday", "Thursday", "Saturday"] },
    { name: "Dr. Prakash Hegde", email: "prakash@doctor.com", specialization: "Psychiatry", qualification: "MBBS, MD", experience: 12, consultationFee: 950, city: "Mangalore", availableDays: ["Monday", "Wednesday"] },
    { name: "Dr. Usha Rani", email: "usha@doctor.com", specialization: "Urology", qualification: "MBBS, MS", experience: 14, consultationFee: 1100, city: "Vijayawada", availableDays: ["Tuesday", "Friday", "Saturday"] },
    { name: "Dr. Dinesh Kamath", email: "dinesh@doctor.com", specialization: "Endocrinology", qualification: "MBBS, MD", experience: 10, consultationFee: 950, city: "Mysore", availableDays: ["Monday", "Wednesday", "Thursday"] },
    { name: "Dr. Farzana Sheikh", email: "farzana@doctor.com", specialization: "Gastroenterology", qualification: "MBBS, MD", experience: 11, consultationFee: 900, city: "Hyderabad", availableDays: ["Tuesday", "Thursday", "Saturday"] },
    { name: "Dr. Rajan Nambiar", email: "rajan@doctor.com", specialization: "Rheumatology", qualification: "MBBS, MD", experience: 13, consultationFee: 800, city: "Trivandrum", availableDays: ["Monday", "Wednesday", "Friday"] },
    { name: "Dr. Smita Kulkarni", email: "smita@doctor.com", specialization: "Pulmonology", qualification: "MBBS, MD", experience: 9, consultationFee: 800, city: "Nashik", availableDays: ["Tuesday", "Thursday"] },
    { name: "Dr. Hemant Pandey", email: "hemant@doctor.com", specialization: "Nephrology", qualification: "MBBS, DM", experience: 15, consultationFee: 1100, city: "Patna", availableDays: ["Monday", "Wednesday", "Saturday"] },
    { name: "Dr. Jayalakshmi T", email: "jayalakshmi@doctor.com", specialization: "Oncology", qualification: "MBBS, MD, DM", experience: 20, consultationFee: 1600, city: "Bangalore", availableDays: ["Tuesday", "Thursday", "Friday"] }
]

const seedDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected")

        const password = await bcrypt.hash("Doctor@123", 10)

        for(const doc of doctors) {
            // Create user
            const user = await User.create({
                name: doc.name,
                email: doc.email,
                password: password,
                role: "doctor",
                isActive: true
            })

            // Create doctor profile
            await Doctor.create({
                userId: user._id,
                specialization: doc.specialization,
                qualification: doc.qualification,
                experience: doc.experience,
                consultationFee: doc.consultationFee,
                city: doc.city,
                availableDays: doc.availableDays,
                isApproved: true,
                rating: (Math.random() * 2 + 3).toFixed(1),
                totalRatings: Math.floor(Math.random() * 100) + 10
            })

            console.log(`✅ Created: ${doc.name}`)
        }

        console.log("🎉 All 50 doctors seeded successfully!")
        process.exit(0)

    } catch(err) {
        console.error("Error:", err.message)
        process.exit(1)
    }
}

seedDB()