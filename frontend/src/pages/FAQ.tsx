import { Link } from "react-router-dom";
import Header from "@/components/Header";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">About Page</h1>
            <Link 
              to="/" 
              className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Back to Chat
            </Link>
          </div>
          
          <div className="space-y-10">
            <h2></h2>
            <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-primary">Mission: Empowering Families to Better Futures</h3>
                  <p className="mt-1 text-muted-foreground">
                  Living in safer and less impoverished areas has long term positive impact for children's futures.
                  Studies have shown that children whose families move to better neighborhoods using housing vouchers are tend to have higher income, are more likely to attend college, and are less likely to live in poverty and be single parents.

                  However, despite the benefits and access to housing vouchers, families are reluctant to move away from their communities and familiar support systems.
                  Housing Hub Assistant aims to empower families and support this transition.
                  </p>
                </div>
              </div>
          </div>

          <div className="space-y-10">
            <h2></h2>
            <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-primary">How will Housing Hub Assistant Help?</h3>
                  <p className="mt-1 text-muted-foreground">
                  Studies have found that Housing Choice vouchers boost children's chances of breaking out of poverty as adults by 50%.
                  Housing Hub encourages families to utilize these vouchers by providing access to up-to-date information on local community resources and services.
                  This reduces the mental and emotional load of moving to a new area and ensures that families are connected to any and all resources they need.
                  The Housing Hub assistant is available 24/7 and attuned to the challenges that low-income families in Philadelphia face and is equipped to handle questions regarding housing policies, child and parent support, food insecurity, immigration and refugee resettlement and more.
                  This reduces the need for parents to make appointments, navigate long documents and confusing websites or stay on hold for hours to get the help they need.
                  </p>
                </div>
              </div>
          </div>

          <div className="space-y-10">
            {/* Using System */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold border-b pb-2">Using the Housing Hub Assistant</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-primary">What can the Housing Hub Assistant help me with?</h3>
                  <p className="mt-1 text-muted-foreground">
                    The Housing Hub Assistant provides families with on-demand information for available services, 
                    eligibility requirements, documentation needs, and procedural guidance without needing to go through the long and intimidating process of scheduleling an office appointment. 
                    It can also help with form completion and case management questions.
                    
                  </p>
                </div>
                
                <div className="space-y-10">
            <h2></h2>
            <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-primary">What can the Housing Hub Assistant help me with?</h3>
                  <p className="mt-1 text-muted-foreground">
                    The Housing Hub Assistant can help families find information about available services, 
                    eligibility requirements, documentation needs, and procedural guidance. It can also 
                    help with form completion and case management questions.
                  </p>
                </div>
              </div>
          </div>

                <div>
                  <h3 className="text-lg font-medium text-primary">How accurate is the information provided?</h3>
                  <p className="mt-1 text-muted-foreground">
                    While we strive for accuracy, the Housing Hub Assistant is an AI tool and may occasionally 
                    provide incomplete or outdated information. Always verify critical information through 
                    official channels and documentation.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-primary">Can I use this with clients present?</h3>
                  <p className="mt-1 text-muted-foreground">
                    Yes, the Housing Hub Assistant is designed to be used during client interactions. However, 
                    remember that you are responsible for verifying the information provided before 
                    sharing it with clients.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Client Services */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold border-b pb-2">Information for Services</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-primary">What benefits programs can I ask about?</h3>
                  <p className="mt-1 text-muted-foreground">
                    You can ask about SNAP (food stamps), TANF, Medicaid, housing assistance, 
                    childcare subsidies, energy assistance, and other public benefits programs.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-primary">How do I find emergency services?</h3>
                  <p className="mt-1 text-muted-foreground">
                    Ask the Housing Hub Assistant about emergency housing, food banks, crisis intervention, 
                    or other immediate needs. For true emergencies requiring immediate intervention, 
                    please seek emergency services by dialing 911.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-primary">Can I get help with specific forms?</h3>
                  <p className="mt-1 text-muted-foreground">
                    Yes, the Housing Hub Assistant can guide you through form completion for many common 
                    forms and applications. Simply ask about the specific form you need help with.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Technical Support */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold border-b pb-2">Technical Support</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-primary">What if the Housing Hub Assistant isn't working?</h3>
                  <p className="mt-1 text-muted-foreground">
                    If you encounter technical issues, try refreshing the page. If problems persist, 
                    contact technical support at <a href="mailto:support@example.com" className="text-primary hover:underline">support@example.com</a>.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-primary">Is my conversation data saved?</h3>
                  <p className="mt-1 text-muted-foreground">
                    Conversations are not permanently stored after your session ends. However, 
                    avoid entering sensitive personal information about clients, such as full names, 
                    Social Security numbers, or other identifiers.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Resources */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold border-b pb-2">Additional Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a 
                  href="https://www.hhs.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
                >
                  <h3 className="text-lg font-medium">Department of Health & Human Services</h3>
                  <p className="text-sm text-muted-foreground mt-1">Official federal resource for health and human services programs</p>
                </a>
                
                <a 
                  href="https://www.benefits.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
                >
                  <h3 className="text-lg font-medium">Benefits.gov</h3>
                  <p className="text-sm text-muted-foreground mt-1">Official benefits website of the U.S. government</p>
                </a>
                
                <a 
                  href="https://www.211.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
                >
                  <h3 className="text-lg font-medium">211.org</h3>
                  <p className="text-sm text-muted-foreground mt-1">Connect with local resources and services</p>
                </a>
                
                <a 
                  href="https://www.findhelp.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
                >
                  <h3 className="text-lg font-medium">FindHelp.org</h3>
                  <p className="text-sm text-muted-foreground mt-1">Search for free or reduced-cost services in your area</p>
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
