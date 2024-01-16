const mongoose = require('mongoose')
const {Schema} = require("mongoose")
const orderSchema = new mongoose.Schema({
    items: {type: [Schema.Types.Mixed], required: true},
    totalAmount: {type: Number},
    totalItems: {type: Number}, 
    user: {type: Schema.Types.ObjectId, ref:"User",  required: true},
    paymentMenthod: {type: String, required: true},
    status: {type: String, default: 'pending'},
    selectedAddres: {type: [Schema.Types.Mixed], required: true},
    

})
const virtual = orderSchema.virtual('id')
virtual.get(function(){
  return this._id
})
orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (responce, ret) {delete ret._id}
})
exports.Order = mongoose.model('Order', orderSchema)