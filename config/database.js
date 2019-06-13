if ( process.env.NODE_ENV === 'production') {
    module.exports= { mongoURI: "mongodb+srv://hide:hide85x@cluster0-chy7b.mongodb.net/vidjot-prod" }
}else {
    module.exports= { mongoURI: "mongodb://localhost/vidjot-dev"} 
}