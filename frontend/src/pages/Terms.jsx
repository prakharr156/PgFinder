import React from "react";
import "./terms.css";

const Terms = () => {
  return (
    <section className="terms-page">
      <div className="terms-container">
        {/* HERO SECTION */}
        <div className="terms-hero">
          <p className="eyebrow">StayVista</p>
          <h1>Terms & Conditions</h1>
          <p className="lead">
            Please read our terms carefully before booking or listing a
            property. By using StayVista, you agree to these terms.
          </p>
        </div>

        {/* CONTENT SECTION */}
        <div className="terms-content">
          <p className="terms-intro">
            These Terms and Conditions establish the rules and regulations for
            using the StayVista platform. Whether you are a property owner
            (provider), a tenant (rider), or both, these terms apply to your
            use of our service. Please review them carefully before proceeding
            with any booking or property listing.
          </p>

          {/* SECTION 1 */}
          <div className="terms-section">
            <h2>
              <i className="fa fa-ban"></i> Non-Refundable Booking Policy
            </h2>

            <p>
              All bookings made through StayVista are{" "}
              <strong>final and non-refundable</strong> once payment is
              confirmed and received.
            </p>

            <p>
              Once a rider has completed the payment process and confirmed their
              booking, the funds are transferred to the property owner and
              cannot be reversed.
            </p>

            <div className="terms-warning">
              <strong>Important:</strong> Cancelled bookings do not qualify for
              refunds.
            </div>
          </div>

          {/* SECTION 2 */}
          <div className="terms-section">
            <h2>
              <i className="fa fa-calendar-check-o"></i> Payment Schedule &
              Monthly Rent Collection
            </h2>

            <p>
              All monthly rent payments must be collected by the property owner{" "}
              <strong>by the last day of each month</strong>.
            </p>

            <ul>
              <li>
                <strong>Payment Due Date:</strong> The last day of each calendar
                month
              </li>

              <li>
                <strong>Rent Payment Method:</strong> Direct transfer, UPI, or
                checks
              </li>

              <li>
                <strong>Late Payment Charges:</strong> A 5% fine will be applied
              </li>

              <li>
                <strong>Non-Payment:</strong> Failure to pay rent for more than
                2 months may result in eviction proceedings
              </li>
            </ul>
          </div>

          {/* SECTION 3 */}
          <div className="terms-section">
            <h2>
              <i className="fa fa-exclamation-triangle"></i> Damage & Breakage
              Policy
            </h2>

            <p>
              Tenants are responsible for maintaining the property in good
              condition.
            </p>

            <div className="terms-highlight">
              <strong>Breakage Charges (Indicative):</strong>

              <ul>
                <li>Window glass/mirror breakage: ₹500 - ₹2,000</li>
                <li>Door/latch damage: ₹1,000 - ₹3,000</li>
                <li>Wall damage: ₹500 - ₹1,500</li>
                <li>Furniture damage: Replacement cost</li>
                <li>Plumbing/electrical damage: ₹2,000 - ₹5,000</li>
              </ul>
            </div>
          </div>

          {/* SECTION 4 */}
          <div className="terms-section">
            <h2>
              <i className="fa fa-shield"></i> Security Deposit & Deductions
            </h2>

            <p>
              A security deposit is typically collected at the time of booking.
            </p>

            <ul>
              <li>
                Security deposit must be returned within 30 days of checkout
              </li>

              <li>Deductions must be documented with proof</li>

              <li>
                Tenants have the right to dispute deductions within 7 days
              </li>
            </ul>
          </div>

          {/* SECTION 5 */}
          <div className="terms-section">
            <h2>
              <i className="fa fa-home"></i> Occupancy & House Rules Compliance
            </h2>

            <ul>
              <li>
                <strong>Maximum Occupancy:</strong> Rooms cannot exceed stated
                occupancy
              </li>

              <li>
                <strong>Guest Policy:</strong> Overnight guests must be approved
              </li>

              <li>
                <strong>Noise & Conduct:</strong> Maintain peaceful living
                conditions
              </li>

              <li>
                <strong>Violations:</strong> Repeated violations may result in
                eviction
              </li>
            </ul>
          </div>

          {/* SECTION 6 */}
          <div className="terms-section">
            <h2>
              <i className="fa fa-briefcase"></i> Property Owner
              Responsibilities
            </h2>

            <ul>
              <li>
                <strong>Maintenance:</strong> Respond within 48 hours
              </li>

              <li>
                <strong>Safety Standards:</strong> Maintain hygiene and safety
              </li>

              <li>
                <strong>Documentation:</strong> Provide agreements in writing
              </li>

              <li>
                <strong>Privacy:</strong> Provide notice before entering
              </li>
            </ul>
          </div>

          {/* SECTION 7 */}
          <div className="terms-section">
            <h2>
              <i className="fa fa-gavel"></i> Cancellation & Dispute Resolution
            </h2>

            <div className="terms-highlight">
              <strong>Dispute Resolution Process:</strong>

              <ul>
                <li>Report disputes within 7 days</li>
                <li>Provide supporting documentation</li>
                <li>Support team will mediate disputes</li>
                <li>Decisions are binding</li>
              </ul>
            </div>
          </div>

          {/* SECTION 8 */}
          <div className="terms-section">
            <h2>
              <i className="fa fa-balance-scale"></i> Liability & Legal
              Compliance
            </h2>

            <ul>
              <li>
                <strong>Local Laws:</strong> Must comply with rental laws
              </li>

              <li>
                <strong>Tax Compliance:</strong> Owners must declare rental
                income
              </li>

              <li>
                <strong>No Liability:</strong> StayVista is not responsible for
                disputes
              </li>
            </ul>
          </div>

          {/* FOOTER */}
          <div className="terms-footer">
            <strong>Last Updated:</strong> April 2026
            <br />
            <strong>Effective Date:</strong> All bookings made from April 2026
            onwards are subject to these terms.
            <br />
            <br />
            For questions regarding these terms, contact support at{" "}
            <strong>support@stayvista.com</strong>
          </div>

          {/* CTA BUTTONS */}
          <div className="terms-cta">
            <a href="/" className="btn-outline">
              Back to Home
            </a>

            <button
              className="btn-primary"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terms;
