This extension aggregates job postings from a list of popular platforms:
Indeed, LinkedIn, ZipRecruiter, Glassdoor, and Google. It fetches data
via each platform's API or parsing method, unifies the results, and
exposes them for display or further processing.


To Run this code you need to have `Python >= 3.9`. Hence, it's recommended to install on Conda

# Installing Conda 

To install Conda, you can follow these steps:

1. Download and install Miniconda or Anaconda from the official site:

    a. [Miniconda](https://docs.conda.io/en/latest/miniconda.html)
    b. [Anaconda](https://www.anaconda.com/products/distribution)
2. Follow the installer’s prompts and restart your terminal.
3. Verify installation by running:


```bash
conda --version
```


# Usage
1. Install the required packages:
```bash
git clone https://github.com/sumansaurabh/JobsCurator.git
cd JobsCurator
cond create -n job_seeker python=3.12
conda activate job_seeker
pip install -r requirements.txt
```

2. Run the library
```bash
python main.py
```
This will run the code

3. Tailor the code for your usage
    a. If you want to search other kinds of jobs, modify `main.py` file.
    b. Look for `search_term="Product Manager",`
    c. Change it to your respective search term
    d. Based on your choices, change the Job location or other fields
