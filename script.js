let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
const form = document.getElementById("jobForm");
const jobList = document.getElementById("jobList");
const filterStatus = document.getElementById("filterStatus");
const clearFilterBtn = document.getElementById("clearFilter");

const savedFilter = localStorage.getItem("selectedFilter");
if (savedFilter) {
  filterStatus.value = savedFilter;
}


function displayJobs() {
  updateStatusCounts();
  jobList.innerHTML = "";

  const selectedFilter = filterStatus.value;

const filteredJobs = jobs
  .map((job, index) => ({ job, index }))
  .filter(item => {
    if (selectedFilter === "All") return true;
    return item.job.status === selectedFilter;
  });


  filteredJobs.forEach(({ job, index }) => {

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${job.company}</td>
      <td>${job.role}</td>

      <td>
  <span class="status-badge status-${job.status.toLowerCase()}">
    ${job.status}
  </span>
  <br><br>
  <select 
  onchange="updateStatus(${index}, this.value)"
  ${job.status === "Offer" ? "disabled" : ""}
>

    <option value="Applied" ${job.status === "Applied" ? "selected" : ""}>Applied</option>
    <option value="Interview" ${job.status === "Interview" ? "selected" : ""}>Interview</option>
    <option value="Rejected" ${job.status === "Rejected" ? "selected" : ""}>Rejected</option>
    <option value="Offer" ${job.status === "Offer" ? "selected" : ""}>Offer</option>
  </select>
</td>


      <td>${job.dateApplied || "-"}</td>
      <td>${job.notes || "-"}</td>

      <td>
        <button onclick="deleteJob(${index})">Delete</button>
      </td>
    `;
    jobList.appendChild(row);
  });
}

function checkInterviewReminders() {
  const banner = document.getElementById("reminderBanner");

  const today = new Date().toISOString().split("T")[0];
  const lastReminderDate = localStorage.getItem("lastInterviewReminder");

  // show only once per day
  if (lastReminderDate === today) return;

  let messages = [];

  jobs.forEach(job => {
    if (job.status === "Interview" && job.dateApplied) {
      const interviewDate = job.dateApplied;

      if (interviewDate === today) {
        messages.push(
          `📢 Interview TODAY at <b>${job.company}</b> for <b>${job.role}</b>`
        );
      }

      const tomorrow = new Date();
      tomorrow.setDate(new Date().getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      if (interviewDate === tomorrowStr) {
        messages.push(
          `⏰ Interview TOMORROW at <b>${job.company}</b> for <b>${job.role}</b>`
        );
      }
    }
  });

  if (messages.length > 0) {
    document.getElementById("reminderMessage").innerHTML =
  `<span class="reminder-icon">⏰</span> ${messages.join(" • ")}`;

banner.classList.remove("hidden");

    localStorage.setItem("lastInterviewReminder", today);
  }
}



function updateStatusCounts() {
  const counts = {
    All: jobs.length,
    Applied: 0,
    Interview: 0,
    Rejected: 0,
    Offer: 0
  };

  jobs.forEach(job => {
    counts[job.status]++;
  });

  // Update dropdown text
  filterStatus.innerHTML = `
    <option value="All">All (${counts.All})</option>
    <option value="Applied">Applied (${counts.Applied})</option>
    <option value="Interview">Interview (${counts.Interview})</option>
    <option value="Rejected">Rejected (${counts.Rejected})</option>
    <option value="Offer">Offer (${counts.Offer})</option>
  `;

  // restore selected filter after rebuilding options
  const savedFilter = localStorage.getItem("selectedFilter") || "All";
  filterStatus.value = savedFilter;
}


displayJobs();

checkInterviewReminders();

filterStatus.addEventListener("change", () => {
  localStorage.setItem("selectedFilter", filterStatus.value);
  displayJobs();
});

clearFilterBtn.addEventListener("click", () => {
  filterStatus.value = "All";                 // reset dropdown
  localStorage.removeItem("selectedFilter");  // clear saved filter
  displayJobs();                              // show all jobs
});


form.addEventListener("submit", function (e) 
{ //This line listens for the form submit event and prepares a function to run when it happens.
e.preventDefault(); //stops the page from refreshing so JavaScript can handle the form properly.
 const company = document.getElementById("company").value; //This line reads the user’s typed company name from the input box and stores it in a JavaScript variable.
 const role = document.getElementById("role").value;
 const status = document.getElementById("status").value;
 const dateApplied = document.getElementById("dateApplied").value;
 const notes = document.getElementById("notes").value;


   if (status === "") {
    alert("Please select a status");
    return;
  }

 
 const job = { company, role, status, dateApplied, notes };
 //This line creates a job object that groups company, role, and status into one unit.
 
 jobs.push(job); //This line adds the newly created job object into the jobs list.

 localStorage.setItem("jobs", JSON.stringify(jobs)); //This line converts the jobs array into text and saves it in the browser so job data is not lost on refresh.
 
 form.reset() //clears the form inputs so the user can add the next job easily.

 displayJobs();

} );

function deleteJob(index) {
  jobs.splice(index, 1);
  localStorage.setItem("jobs", JSON.stringify(jobs));
  displayJobs();
}


function updateStatus(index, newStatus) {
  jobs[index].status = newStatus;
  localStorage.setItem("jobs", JSON.stringify(jobs));
  displayJobs();
}

function closeReminder() {
  document.getElementById("reminderBanner").classList.add("hidden");
}


//this means the current dropdown
//this.value means selected option
