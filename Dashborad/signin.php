<?php
$host = "localhost";
$port = "3307"; // Aapka port no 3307 hai
$login_Form = "login_Form"; // Aapka database name
$username = "root"; // Default username (agar badla nahi hai toh)
$password = ""; // Default password (agar set nahi kiya toh)

try {
    // Port aur database name ko variable se sahi tarike se jod diya hai
    $conn = new PDO("mysql:host=$host;port=$port;dbname=$login_Form", $username, $password);
    
    // Error mode ko exception par set kiya
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Agar sab sahi raha toh check karne ke liye (Aap ise hata bhi sakte hain)
    // echo "Connection successful!"; 
    
} catch(PDOException $exception) {
    // Yahan jo extra text tha use hata diya hai ya comment kar sakte hain
    http_response_code(500);      
    echo json_encode(array("status" => "error", "message" => "Database connection error: " . $exception->getMessage()));
    exit();
}

// ... Aapka purana connection code yahan tak rahega ...
try {
    $conn = new PDO("mysql:host=$host;port=$port;dbname=$login_Form", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // ---- YAHAN SE NAYA LOGIN LOGIC SHURU HOTAI HAI ----
    
    // Yeh check karega ki kya request POST method se aayi hai aur raw JSON data mila hai
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        // Chunki Javascript Fetch API se data JSON me aayega, hum use decode karenge
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (isset($data['email']) && isset($data['password'])) {
            $email = trim($data['email']);
            $pass = $data['password'];
            
            // Safe query PDO prepared statement ke sath (SQL Injection se bachne ke liye)
            $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Password verify karein (Registration ke waqt password_hash use kiya hona chahiye)
                if (password_verify($pass, $user['password']) || $pass === $user['password']) {
                    // NOTE: Production me hamesha password_verify() use karein. Agar plain text password save hai toh abhi ke liye direct match chalega.
                    
                    session_start();
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['user_email'] = $user['email'];
                    
                    // Success Response bhejien
                    echo json_encode(array("status" => "success", "message" => "Login successful!"));
                    exit();
                } else {
                    http_response_code(401);
                    echo json_encode(array("status" => "error", "message" => "Galat password! Kripya dobara koshish karein."));
                    exit();
                }
            } else {
                http_response_code(404);
                echo json_encode(array("status" => "error", "message" => "Yeh email register nahi hai!"));
                exit();
            }
        } else {
            http_response_code(400);
            echo json_encode(array("status" => "error", "message" => "Email aur Password dono zaroori hain."));
            exit();
        }
    }

} catch(PDOException $exception) {
    http_response_code(500);      
    echo json_encode(array("status" => "error", "message" => "Database connection error: " . $exception->getMessage()));
    exit();
}
?>