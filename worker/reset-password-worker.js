const queue = require('../config/kue');

const resetPasswordMailer = require('../mailers/reset-password-mailer');


//whenever a new task is added to the queue, process function will tell the worker to run the code inside it[process]
queue.process('resets', function(job, done){
    // console.log('emails worker is processing a job ', job.data);

    //operations to be performed
    resetPasswordMailer.resetPasswordLink(job.data);

    //on success completion of the process
    done();
});