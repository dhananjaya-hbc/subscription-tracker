import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription Name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be greater than 0'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'INR'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['daily','weekly','monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['news','sport','lifestyle','Entertainment', 'Productivity', 'Health', 'Education', 'Other'],
        reqired: true,
    },
    paymentMethod:{
        type: String,
        reqired: true,
        trim: true,
    },
    status:{
        type: String,
        enum: ['active','canceled','expired'],
        default: 'active',

    },
    startDate:{
        type: Date,
        required: true,
        validator: {
            validator:(value) => value <= new Date(),
            message: 'Start date cannot be in the future',
        }
    },
    renewalDate:{
        type: Date,
        required: true,
        validator: {
            validator: function(value){
                return value > this.startDate;
            },
            message: 'Renewal date must be after start date',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },


},    option: { timestamps: true });

//auto calculate renewal date based if missing
subscriptionSchema.pre('save', function(next){
    if(!this.renewalDate){
        const renewaPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewaPeriods[this.frequency]);
    }

    //auto=update the status if renewal date has pased
    if(this.renewalDate < new Date() ){
        this.status = 'expired';
    }
    next();

});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;