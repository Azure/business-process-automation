
import React, { useState, useEffect } from 'react'
import Stages from './Stages'
import CurrentPipeline from './CurrentPipeline'
import Home from './Home'
import Upload from './Upload';
import { Breadcrumb } from '@fluentui/react-northstar';
import { ChevronEndMediumIcon } from '@fluentui/react-icons-northstar'
import ViewInsights from './ViewInsights';
import axios from 'axios';

const docs = [
    {
        "filename": "test/LMA04585-Lease-_Z (5).pdf",
        "cner": [
            {
                "text": "LMA04585",
                "category": "lease_num",
                "offset": 154,
                "length": 8,
                "confidenceScore": 0.98
            },
            {
                "text": "MA5793",
                "category": "lease_num",
                "offset": 176,
                "length": 6,
                "confidenceScore": 0.75
            },
            {
                "text": "SIS",
                "category": "landlord",
                "offset": 242,
                "length": 3,
                "confidenceScore": 0.67
            }

        ],
        "ocr": "STANDARD FORM 2 FEBRUARY 1965 EDITION US GOVERNMENT GENERAL SERVICES ADMINISTRATION LEASE FOR REAL PROPERTY FPR (41CFR) 1-16.601 DATE OF LEASE LEASE NO. LMA04585 Building No. MA5793 THIS LEASE, made and entered into this date by and between SIS Center, Inc. whose address is 1441 Main Street Springfield, MA 01103 and whose interest in the property hereinafter described is that of owner hereinafter called the Lessor, and the UNITED STATES OF AMERICA, hereinafter called the Government: WITNESSETH: The parties hereto for the considerations hereinafter mentioned, covenant and agree as follows: 1. LESSOR HEREBY LEASES TO THE GOVERNMENT AND THE GOVERNMENT HEREBY LEASES FROM THE LESSOR THE FOLLOWING DESCRIBED PREMISES: An area of 12,621 Rentable Square Feet (RSF), with a Common Area Factor of 15.0%, yielding 10,975 ANSI/BOMA Office Area (occasionally herein referred to as Usable) Square Feet located on the 10 floor at 1441 Main Street, Springfield, Massachusetts (hereinafter the \"Building\"), and further identified on the plans entitled \" Tenth Floor Plan\" attached hereto as Exhibit \"A\" along with 20 secure garage parking spaces located at 186 Chestnut Street and identified as \"Garage Parking Plan\" attached hereto as Exhibit \"B: along with an additional 16 on-site surface parking spaces. All parking, all improvements and all amenities being collectively hereinafter referred to as the Premises or the Leased Premises, all of which are leased to the Government together with any and all appurtenances, rights, privileges and easements now or hereafter benefiting, belonging or appertaining thereto, including without limitation use of all common areas and facilities, and rights of ingress and egress to the Building, the Leased Premises and all common areas and appurtenances, to be used for general Government purposes as determined by the General Services Administration. 2. TERM: TO HAVE AND TO HOLD the said Premises with their appurtenances for a term of ten (10) years (five [5] firm), commencing on the next business day, excluding Saturdays, Sundays and Federal Holidays, following the Delivery of the Leased Premises in full compliance with the terms and conditions of Paragraph 6 & 7 hereof (the \"Commencement Date\"), and ending ten years thereafter, unless further extended or terminated sooner as provided herein or as may be allowed at law or in equity (the Lease Term). Upon actual determination of the Commencement Date, and consequently the Lease Term, the Lessor and the Government shall confirm in writing the Commencement Date and the Termination Date of the Lease and the Government's acceptance of the Leased Premises by execution and delivery of a Supplemental Lease Agreement. 3. TERMINATION RIGHT: THE GOVERNMENT MAY TERMINATE this Lease in whole or in part at any time on or after the last day of the fifth (5th) year by giving at least one hundred-twenty (120) days' prior notice in writing to the Lessor and no rental shall accrue after the effective date of termination. Said one hundred- twenty (120) day period shall be computed commencing with the day after the date of mailing of the notice by the Government. 4. THE GOVERNMENT SHALL PAY to the Lessor, commencing on the Commencement Date and payable via Electronic Funds Transfer, rent as follows: Years One through Five: Annual Rent in the amount of $392, 101.00, payable in the amount of $32,675.08 per month in arrears, plus CPI escalations after the first year, if applicable; Years Six through Ten; Annual Rent of $299, 336.25 payable in the amount of $24,944.69 per month in arrears, plus CPI escalations, if applicable, to: SIS Center, Inc. 1441 Main Street 1 INITIALS: LESSOR GOV Springfield, MA 01103 Rent for a period of less than one month shall be prorated on a per diem basis. 5. COMMISSION AND COMMISSION CREDIT: The Lessor and the Broker have agreed to a cooperating lease commission of_of the firm term value of the lease. The total amount of the commission is The Lessor shall pay the Broker no additional commissions associated with this lease transaction. In accordance with the \"Broker Commission and Commission Credit\" paragraph, the Broker has agreed to forgo of the commission that it is entitled to receive in connection with this lease transaction (\"Commission Credit\"). The Commission Credit is . The Lessor agrees to pay the Commission less the Commission Credit to the Broker in accordance with the \"Broker Commission and Commission Credit\" paragraph in the SFO attached to and forming a part of this lease. The total amount due the Broker is payable upon lease commencement). payable upon lease execution, Notwithstanding Paragraph 4 of the Lease, the shell rental payments due and owing under this lease shall be reduced to fully recapture this Commission Credit. The reduction in shell rent shall commence with the first month of the rental payments and continue as indicated in this schedule for adjusted Monthly Rent: First month's Rental Payment of $32,675.08 minus prorated Commission Credit of adjusted First Month's Rent. equals Second Month's Rental Payment $32,675.08 minus prorated Commission Credit of equals adjusted Second Month's Rent. Third Month's Rental Payment $32,675.08 minus prorated Commission Credit of equals adjusted Third Month's Rent. Fourth Month's Rental Payment $32,675.08 minus prorated Commission Credit of equals adjusted Fourth Month's Rent. 6. THE LESSOR SHALL FURNISH TO THE GOVERNMENT, for the stated rental consideration specified in Paragraph 4 above and at no further cost or expense to the Government, the following: (a) The Leased Premises, and all appurtenances, rights and privileges as described in Paragraph 1 hereof; (b) All requirements including, but not limited to, all services, utilities, compliance activities and efforts, alterations, improvements, build-out (except for lump sum reimbursable items, if any), and maintenance, repair and replacement requirements, all as specified in or contemplated by Solicitation for Offers 7MA2082, dated June 4, 2008, (hereinafter, the \"SFO\"), which is attached hereto and by this reference made a part hereof; (c) All construction in accordance with the SFO, including, without limitation, all provisions of the Architectural Finish Section of the SFO and Government Layout Drawings, Finish and Door Schedules, to be incorporated herein by reference upon completion; (d) All provisions and specifications of the Lesson's initial proposal dated June 25, 2008, and revised revised proposals; proposal dated August 22, 2008, as submitted in response to the SFO and the Government's request for (e) All services, including, without limitation, construction drawings and specifications, engineering and architectural services, and all permitting and approval requirements as are necessary to effect the construction and delivery of the Leased Premises in accordance with the requirements described herein; and by this Lease. (f) All rights, reservations of rights, privileges and the like as specified in, described by, or contemplated 7. IN REFERENCE TO BUILDOUT AND DELIVERY of the Leased Premises, the Lessor agrees to the following: (a) In no event shall the Leased Premises be deemed to be ready for occupancy unless the same shall 2 INITIALS RN CHRIS LESSOR GOVT. comply fully with all provisions of this Lease, including, but not limited to, the substantial completion of all improvements, requirements and construction in accordance with the specifications contained in this Lease, the SFO and the Government Layout Drawings and Finish Schedules, as referenced above and all documents referenced in the SFO and this Lease. (b) The phrase \"substantial completion\" (or \"substantially complete\") shall mean that all work necessary to deliver the Leased Premises in accordance with each and every requirement and specification of this Lease, and all other appurtenant things necessary for the Government's access to the Leased Premises and the full occupancy, possession, use and enjoyment thereof, shall have been completed or obtained, including, without limitation, all required reviews, approvals, consents and permits including a certificate of occupancy for the Leased Premises allowing occupancy for each of the uses described in and by this Lease, excepting only such minor matters as do not interfere with or diminish such access, occupancy, possession, use or enjoyment. In no event will the Leased Premises be deemed \"substantially complete\" or ready for occupancy unless the security system for the Leased Premises is fully operational, as determined by the Tenant Agency and Contracting Officer. (c) The Lessor hereby agrees that, as regards delivery of the Leased Premises to the Government ready for occupancy (hereinafter, \"Delivery\"): (i) Time is of the essence, (ii) Lessor shall effect Delivery of the Tenant Improvements in eighty-five (85) working days from the written \"Notice to Proceed, to be mutually agreed upon by the Government and the Lessor upon completion of the the \"Delivery Date\"). Construction Drawings, following delivery of the Government Layout Drawings and Finish Schedules (hereinafter (iii) Except with regard to such \"Punch List\" items as may be identified in the Acceptance Notice as defined in Paragraph 7 (c)(v) hereof, it is a condition precedent to Delivery that all construction required under this Lease shall be substantially complete and comply"
    },
    {
        "filename": "test/other.pdf",
        "id": "1",
        "ner": [
            {
                "text": "trip",
                "category": "Event",
                "offset": 18,
                "length": 4,
                "confidenceScore": 0.74
            },
            {
                "text": "Seattle",
                "category": "Location",
                "subcategory": "GPE",
                "offset": 26,
                "length": 7,
                "confidenceScore": 1.0
            },
            {
                "text": "last week",
                "category": "DateTime",
                "subcategory": "DateRange",
                "offset": 34,
                "length": 9,
                "confidenceScore": 0.8
            }
        ],
        "ocr": "I had a wonderful trip to Seattle last week.",
        "warnings": []
    },
    {
        "filename":"test",
        "ner": [
              {
                "text": "2 FEBRUARY 1965",
                "category": "DateTime",
                "subcategory": "Date",
                "offset": 15,
                "length": 15,
                "confidenceScore": 0.8
              },
              {
                "text": "US",
                "category": "Location",
                "subcategory": "GPE",
                "offset": 39,
                "length": 2,
                "confidenceScore": 0.55
              },
              {
                "text": "GOVERNMENT GENERAL SERVICES",
                "category": "Organization",
                "offset": 42,
                "length": 27,
                "confidenceScore": 0.54
              },
              {
                "text": "1",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 121,
                "length": 1,
                "confidenceScore": 0.8
              },
              {
                "text": "16.601",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 123,
                "length": 6,
                "confidenceScore": 0.8
              },
              {
                "text": "SIS Center, Inc.",
                "category": "Organization",
                "offset": 242,
                "length": 16,
                "confidenceScore": 0.93
              },
              {
                "text": "1441 Main Street Springfield, MA 01103",
                "category": "Address",
                "offset": 276,
                "length": 38,
                "confidenceScore": 0.81
              },
              {
                "text": "1441",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 276,
                "length": 4,
                "confidenceScore": 0.8
              },
              {
                "text": "01103",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 309,
                "length": 5,
                "confidenceScore": 0.8
              },
              {
                "text": "owner",
                "category": "PersonType",
                "offset": 383,
                "length": 5,
                "confidenceScore": 0.81
              },
              {
                "text": "UNITED STATES OF AMERICA",
                "category": "Location",
                "subcategory": "GPE",
                "offset": 428,
                "length": 24,
                "confidenceScore": 0.95
              },
              {
                "text": "1",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 597,
                "length": 1,
                "confidenceScore": 0.8
              },
              {
                "text": "12,621",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 733,
                "length": 6,
                "confidenceScore": 0.8
              },
              {
                "text": "Square Feet",
                "category": "Quantity",
                "subcategory": "Dimension",
                "offset": 749,
                "length": 11,
                "confidenceScore": 0.8
              },
              {
                "text": "15.0%",
                "category": "Quantity",
                "subcategory": "Percentage",
                "offset": 797,
                "length": 5,
                "confidenceScore": 0.8
              },
              {
                "text": "10,975",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 813,
                "length": 6,
                "confidenceScore": 0.8
              },
              {
                "text": "Office Area",
                "category": "Location",
                "offset": 830,
                "length": 11,
                "confidenceScore": 0.6
              },
              {
                "text": "Square Feet",
                "category": "Quantity",
                "subcategory": "Dimension",
                "offset": 888,
                "length": 11,
                "confidenceScore": 0.8
              },
              {
                "text": "the 10",
                "category": "DateTime",
                "subcategory": "Date",
                "offset": 911,
                "length": 6,
                "confidenceScore": 0.8
              },
              {
                "text": "10\"",
                "category": "Quantity",
                "subcategory": "Dimension",
                "offset": 915,
                "length": 3,
                "confidenceScore": 0.8
              },
              {
                "text": "1441 Main Street, Springfield",
                "category": "Address",
                "offset": 928,
                "length": 29,
                "confidenceScore": 0.83
              },
              {
                "text": "1441",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 928,
                "length": 4,
                "confidenceScore": 0.8
              },
              {
                "text": "Massachusetts",
                "category": "Location",
                "subcategory": "GPE",
                "offset": 959,
                "length": 13,
                "confidenceScore": 0.45
              },
              {
                "text": "Tenth",
                "category": "Quantity",
                "subcategory": "Ordinal",
                "offset": 1050,
                "length": 5,
                "confidenceScore": 0.8
              },
              {
                "text": "20",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 1110,
                "length": 2,
                "confidenceScore": 0.8
              },
              {
                "text": "garage",
                "category": "Location",
                "subcategory": "Structural",
                "offset": 1120,
                "length": 6,
                "confidenceScore": 0.73
              },
              {
                "text": "spaces",
                "category": "Location",
                "offset": 1135,
                "length": 6,
                "confidenceScore": 0.53
              },
              {
                "text": "186 Chestnut Street",
                "category": "Address",
                "offset": 1153,
                "length": 19,
                "confidenceScore": 0.99
              },
              {
                "text": "186",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 1153,
                "length": 3,
                "confidenceScore": 0.8
              },
              {
                "text": "16",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 1269,
                "length": 2,
                "confidenceScore": 0.8
              },
              {
                "text": "parking spaces",
                "category": "Location",
                "offset": 1288,
                "length": 14,
                "confidenceScore": 0.49
              },
              {
                "text": "parking",
                "category": "Location",
                "offset": 1308,
                "length": 7,
                "confidenceScore": 0.54
              },
              {
                "text": "now",
                "category": "DateTime",
                "offset": 1555,
                "length": 3,
                "confidenceScore": 0.8
              },
              {
                "text": "Building",
                "category": "Location",
                "offset": 1728,
                "length": 8,
                "confidenceScore": 0.86
              },
              {
                "text": "Leased Premises",
                "category": "Location",
                "offset": 1742,
                "length": 15,
                "confidenceScore": 0.79
              },
              {
                "text": "areas",
                "category": "Location",
                "offset": 1773,
                "length": 5,
                "confidenceScore": 0.67
              },
              {
                "text": "General Services Administration",
                "category": "Organization",
                "offset": 1862,
                "length": 31,
                "confidenceScore": 1
              },
              {
                "text": "2",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 1895,
                "length": 1,
                "confidenceScore": 0.8
              },
              {
                "text": "Premises",
                "category": "Location",
                "offset": 1933,
                "length": 8,
                "confidenceScore": 0.6
              },
              {
                "text": "ten",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 1981,
                "length": 3,
                "confidenceScore": 0.8
              },
              {
                "text": "10",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 1986,
                "length": 2,
                "confidenceScore": 0.8
              },
              {
                "text": "five",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 1997,
                "length": 4,
                "confidenceScore": 0.8
              },
              {
                "text": "5",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 2003,
                "length": 1,
                "confidenceScore": 0.8
              },
              {
                "text": "next business day",
                "category": "DateTime",
                "subcategory": "DateRange",
                "offset": 2031,
                "length": 17,
                "confidenceScore": 0.8
              },
              {
                "text": "Saturdays",
                "category": "DateTime",
                "subcategory": "Set",
                "offset": 2060,
                "length": 9,
                "confidenceScore": 0.8
              },
              {
                "text": "Sundays",
                "category": "DateTime",
                "subcategory": "Set",
                "offset": 2071,
                "length": 7,
                "confidenceScore": 0.8
              },
              {
                "text": "6",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 2209,
                "length": 1,
                "confidenceScore": 0.8
              },
              {
                "text": "7",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 2213,
                "length": 1,
                "confidenceScore": 0.8
              },
              {
                "text": "ten years",
                "category": "DateTime",
                "subcategory": "Duration",
                "offset": 2260,
                "length": 9,
                "confidenceScore": 0.8
              },
              {
                "text": "Lessor",
                "category": "PersonType",
                "offset": 2496,
                "length": 6,
                "confidenceScore": 0.87
              },
              {
                "text": "writing",
                "category": "Skill",
                "offset": 2539,
                "length": 7,
                "confidenceScore": 0.74
              },
              {
                "text": "3",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 2723,
                "length": 1,
                "confidenceScore": 0.8
              },
              {
                "text": "MAY",
                "category": "DateTime",
                "subcategory": "DateRange",
                "offset": 2760,
                "length": 3,
                "confidenceScore": 0.8
              },
              {
                "text": "on or after the last day",
                "category": "DateTime",
                "subcategory": "DateRange",
                "offset": 2817,
                "length": 24,
                "confidenceScore": 0.8
              },
              {
                "text": "fifth",
                "category": "Quantity",
                "subcategory": "Ordinal",
                "offset": 2849,
                "length": 5,
                "confidenceScore": 0.8
              },
              {
                "text": "5th",
                "category": "Quantity",
                "subcategory": "Ordinal",
                "offset": 2856,
                "length": 3,
                "confidenceScore": 0.8
              },
              {
                "text": "one hundred",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 2885,
                "length": 11,
                "confidenceScore": 0.8
              },
              {
                "text": "twenty",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 2897,
                "length": 6,
                "confidenceScore": 0.8
              },
              {
                "text": "120",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 2905,
                "length": 3,
                "confidenceScore": 0.8
              },
              {
                "text": "writing",
                "category": "Skill",
                "offset": 2932,
                "length": 7,
                "confidenceScore": 0.84
              },
              {
                "text": "Lessor",
                "category": "PersonType",
                "offset": 2947,
                "length": 6,
                "confidenceScore": 0.91
              },
              {
                "text": "one hundred",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 3027,
                "length": 11,
                "confidenceScore": 0.8
              },
              {
                "text": "twenty",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 3040,
                "length": 6,
                "confidenceScore": 0.8
              },
              {
                "text": "120",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 3048,
                "length": 3,
                "confidenceScore": 0.8
              },
              {
                "text": "the day after",
                "category": "DateTime",
                "subcategory": "Date",
                "offset": 3098,
                "length": 13,
                "confidenceScore": 0.8
              },
              {
                "text": "4",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 3165,
                "length": 1,
                "confidenceScore": 0.8
              },
              {
                "text": "Lessor",
                "category": "PersonType",
                "offset": 3200,
                "length": 6,
                "confidenceScore": 0.91
              },
              {
                "text": "One",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 3310,
                "length": 3,
                "confidenceScore": 0.8
              },
              {
                "text": "Five",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 3322,
                "length": 4,
                "confidenceScore": 0.8
              },
              {
                "text": "Annual",
                "category": "DateTime",
                "subcategory": "Set",
                "offset": 3328,
                "length": 6,
                "confidenceScore": 0.8
              },
              {
                "text": "$392",
                "category": "Quantity",
                "subcategory": "Currency",
                "offset": 3357,
                "length": 4,
                "confidenceScore": 0.8
              },
              {
                "text": "101.00",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 3363,
                "length": 6,
                "confidenceScore": 0.8
              },
              {
                "text": "$32,675.08",
                "category": "Quantity",
                "subcategory": "Currency",
                "offset": 3396,
                "length": 10,
                "confidenceScore": 0.8
              },
              {
                "text": "first",
                "category": "Quantity",
                "subcategory": "Ordinal",
                "offset": 3460,
                "length": 5,
                "confidenceScore": 0.8
              },
              {
                "text": "Six",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 3493,
                "length": 3,
                "confidenceScore": 0.8
              },
              {
                "text": "Ten",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 3505,
                "length": 3,
                "confidenceScore": 0.8
              },
              {
                "text": "Annual",
                "category": "DateTime",
                "subcategory": "Set",
                "offset": 3510,
                "length": 6,
                "confidenceScore": 0.8
              },
              {
                "text": "$299",
                "category": "Quantity",
                "subcategory": "Currency",
                "offset": 3525,
                "length": 4,
                "confidenceScore": 0.8
              },
              {
                "text": "336.25",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 3531,
                "length": 6,
                "confidenceScore": 0.8
              },
              {
                "text": "$24,944.69",
                "category": "Quantity",
                "subcategory": "Currency",
                "offset": 3563,
                "length": 10,
                "confidenceScore": 0.8
              },
              {
                "text": "SIS Center, Inc",
                "category": "Organization",
                "offset": 3637,
                "length": 15,
                "confidenceScore": 0.93
              },
              {
                "text": "1441 Main Street 1",
                "category": "Address",
                "offset": 3654,
                "length": 18,
                "confidenceScore": 0.89
              },
              {
                "text": "1441",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 3654,
                "length": 4,
                "confidenceScore": 0.8
              },
              {
                "text": "1",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 3671,
                "length": 1,
                "confidenceScore": 0.8
              },
              {
                "text": "LESSOR GOV Springfield, MA",
                "category": "Address",
                "offset": 3683,
                "length": 26,
                "confidenceScore": 0.6
              },
              {
                "text": "01103",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 3710,
                "length": 5,
                "confidenceScore": 0.8
              },
              {
                "text": "less than one month",
                "category": "DateTime",
                "subcategory": "Duration",
                "offset": 3737,
                "length": 19,
                "confidenceScore": 0.8
              },
              {
                "text": "5",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 3796,
                "length": 1,
                "confidenceScore": 0.8
              },
              {
                "text": "Lessor",
                "category": "PersonType",
                "offset": 3837,
                "length": 6,
                "confidenceScore": 0.92
              },
              {
                "text": "Broker",
                "category": "PersonType",
                "offset": 3852,
                "length": 6,
                "confidenceScore": 0.93
              },
              {
                "text": "Lessor",
                "category": "PersonType",
                "offset": 3987,
                "length": 6,
                "confidenceScore": 0.88
              },
              {
                "text": "Broker",
                "category": "PersonType",
                "offset": 4008,
                "length": 6,
                "confidenceScore": 0.95
              },
              {
                "text": "Broker",
                "category": "PersonType",
                "offset": 4161,
                "length": 6,
                "confidenceScore": 0.89
              },
              {
                "text": "Lessor",
                "category": "PersonType",
                "offset": 4333,
                "length": 6,
                "confidenceScore": 0.89
              },
              {
                "text": "Broker",
                "category": "PersonType",
                "offset": 4403,
                "length": 6,
                "confidenceScore": 0.88
              },
              {
                "text": "Broker",
                "category": "PersonType",
                "offset": 4567,
                "length": 6,
                "confidenceScore": 0.93
              },
              {
                "text": "4",
                "category": "Quantity",
                "subcategory": "Number",
                "offset": 4667,
                "length": 1,
                "confidenceScore": 0.8
              },
              {
                "text": "first",
                "category": "Quantity",
                "subcategory": "Ordinal",
                "offset": 4852,
                "length": 5,
                "confidenceScore": 0.8
              },
              {
                "text": "Monthly",
                "category": "DateTime",
                "subcategory": "Set",
                "offset": 4943,
                "length": 7,
                "confidenceScore": 0.8
              },
              {
                "text": "First",
                "category": "Quantity",
                "subcategory": "Ordinal",
                "offset": 4957,
                "length": 5,
                "confidenceScore": 0.8
              },
              {
                "text": "$32,675.08",
                "category": "Quantity",
                "subcategory": "Currency",
                "offset": 4989,
                "length": 10,
                "confidenceScore": 0.8
              }
            ],
            "cner": [
              {
                "text": "MA5793",
                "category": "lease_num",
                "offset": 176,
                "length": 6,
                "confidenceScore": 0.75
              },
              {
                "text": "LESSOR GOV",
                "category": "landlord",
                "offset": 3683,
                "length": 10,
                "confidenceScore": 0.84
              },
              {
                "text": "Agency and Contracting Officer.",
                "category": "landlord",
                "offset": 8604,
                "length": 31,
                "confidenceScore": 0.88
              },
              {
                "text": "Contracting Officer",
                "category": "landlord",
                "offset": 12182,
                "length": 19,
                "confidenceScore": 0.87
              },
              {
                "text": "BOMA",
                "category": "landlord",
                "offset": 14682,
                "length": 4,
                "confidenceScore": 0.52
              },
              {
                "text": "LESSOR GOV'T.",
                "category": "landlord",
                "offset": 17524,
                "length": 13,
                "confidenceScore": 0.94
              },
              {
                "text": "Officer 12.",
                "category": "landlord",
                "offset": 17984,
                "length": 11,
                "confidenceScore": 1
              },
              {
                "text": "Government",
                "category": "landlord",
                "offset": 18525,
                "length": 10,
                "confidenceScore": 0.62
              },
              {
                "text": "contractors",
                "category": "landlord",
                "offset": 18543,
                "length": 11,
                "confidenceScore": 0.96
              },
              {
                "text": "Services Administration",
                "category": "landlord",
                "offset": 24133,
                "length": 23,
                "confidenceScore": 0.83
              },
              {
                "text": "Buildings Service 10 Causeway",
                "category": "landlord",
                "offset": 24165,
                "length": 29,
                "confidenceScore": 0.82
              },
              {
                "text": "and suppliers.",
                "category": "landlord",
                "offset": 24517,
                "length": 14,
                "confidenceScore": 0.65
              },
              {
                "text": "LESSOR GOV'T.",
                "category": "landlord",
                "offset": 25926,
                "length": 13,
                "confidenceScore": 0.96
              },
              {
                "text": "Center",
                "category": "landlord",
                "offset": 26064,
                "length": 6,
                "confidenceScore": 0.65
              },
              {
                "text": "LESSOR GOVT.",
                "category": "landlord",
                "offset": 26176,
                "length": 12,
                "confidenceScore": 0.98
              }
            ],
        "ocr": " STANDARD FORM 2 FEBRUARY 1965 EDITION US GOVERNMENT GENERAL SERVICES ADMINISTRATION LEASE FOR REAL PROPERTY FPR (41CFR) 1-16.601 DATE OF LEASE LEASE NO. LMA04585 Building No. MA5793 THIS LEASE, made and entered into this date by and between SIS Center, Inc. whose address is 1441 Main Street Springfield, MA 01103 and whose interest in the property hereinafter described is that of owner hereinafter called the Lessor, and the UNITED STATES OF AMERICA, hereinafter called the Government: WITNESSETH: The parties hereto for the considerations hereinafter mentioned, covenant and agree as follows: 1. LESSOR HEREBY LEASES TO THE GOVERNMENT AND THE GOVERNMENT HEREBY LEASES FROM THE LESSOR THE FOLLOWING DESCRIBED PREMISES: An area of 12,621 Rentable Square Feet (RSF), with a Common Area Factor of 15.0%, yielding 10,975 ANSI/BOMA Office Area (occasionally herein referred to as \"Usable\") Square Feet located on the 10\" floor at 1441 Main Street, Springfield, Massachusetts (hereinafter the \"Building\"), and further identified on the plans entitled \" Tenth Floor Plan\" attached hereto as Exhibit \"A\" along with 20 secure garage parking spaces located at 186 Chestnut Street and identified as \"Garage Parking Plan\" attached hereto as Exhibit \"B: along with an additional 16 on-site surface parking spaces. All parking, all improvements and all amenities being collectively hereinafter referred to as the \"Premises\" or the \"Leased Premises\", all of which are leased to the Government together with any and all appurtenances, rights, privileges and easements now or hereafter benefiting, belonging or appertaining thereto, including without limitation use of all common areas and facilities, and rights of ingress and egress to the Building, the Leased Premises and all common areas and appurtenances, to be used for general Government purposes as determined by the General Services Administration. 2. TERM: TO HAVE AND TO HOLD the said Premises with their appurtenances for a term of ten (10) years (five [5] firm), commencing on the next business day, excluding Saturdays, Sundays and Federal Holidays, following the Delivery of the Leased Premises in full compliance with the terms and conditions of Paragraph 6 & 7 hereof (the \"Commencement Date\"), and ending ten years thereafter, unless further extended or terminated sooner as provided herein or as may be allowed at law or in equity (the \"Lease Term\"). Upon actual determination of the Commencement Date, and consequently the Lease Term, the Lessor and the Government shall confirm in writing the Commencement Date and the Termination Date of the Lease and the Government's acceptance of the Leased Premises by execution and delivery of a Supplemental Lease Agreement. 3. TERMINATION RIGHT: THE GOVERNMENT MAY TERMINATE this Lease in whole or in part at any time on or after the last day of the fifth (5th) year by giving at least one hundred-twenty (120) days' prior notice in writing to the Lessor and no rental shall accrue after the effective date of termination. Said one hundred- twenty (120) day period shall be computed commencing with the day after the date of mailing of the notice by the Government. 4. THE GOVERNMENT SHALL PAY to the Lessor, commencing on the Commencement Date and payable via Electronic Funds Transfer, rent as follows: Years One through Five: Annual Rent in the amount of $392, 101.00, payable in the amount of $32,675.08 per month in arrears, plus CPI escalations after the first year, if applicable; Years Six through Ten; Annual Rent of $299, 336.25 payable in the amount of $24,944.69 per month in arrears, plus CPI escalations, if applicable, to: SIS Center, Inc. 1441 Main Street 1 INITIALS: LESSOR GOV Springfield, MA 01103 Rent for a period of less than one month shall be prorated on a per diem basis. 5. COMMISSION AND COMMISSION CREDIT: The Lessor and the Broker have agreed to a cooperating lease commission of_of the firm term value of the lease. The total amount of the commission is The Lessor shall pay the Broker no additional commissions associated with this lease transaction. In accordance with the \"Broker Commission and Commission Credit\" paragraph, the Broker has agreed to forgo of the commission that it is entitled to receive in connection with this lease transaction (\"Commission Credit\"). The Commission Credit is . The Lessor agrees to pay the Commission less the Commission Credit to the Broker in accordance with the \"Broker Commission and Commission Credit\" paragraph in the SFO attached to and forming a part of this lease. The total amount due the Broker is payable upon lease commencement). payable upon lease execution, Notwithstanding Paragraph 4 of the Lease, the shell rental payments due and owing under this lease shall be reduced to fully recapture this Commission Credit. The reduction in shell rent shall commence with the first month of the rental payments and continue as indicated in this schedule for adjusted Monthly Rent: First month's Rental Payment of $32,675.08 minus prorated Commission Credit of adjusted First Month's Rent. equals Second Month's Rental Payment $32,675.08 minus prorated Commission Credit of equals adjusted Second Month's Rent. Third Month's Rental Payment $32,675.08 minus prorated Commission Credit of equals adjusted Third Month's Rent. Fourth Month's Rental Payment $32,675.08 minus prorated Commission Credit of equals adjusted Fourth Month's Rent. 6. THE LESSOR SHALL FURNISH TO THE GOVERNMENT, for the stated rental consideration specified in Paragraph 4 above and at no further cost or expense to the Government, the following: (a) The Leased Premises, and all appurtenances, rights and privileges as described in Paragraph 1 hereof; (b) All requirements including, but not limited to, all services, utilities, compliance activities and efforts, alterations, improvements, build-out (except for lump sum reimbursable items, if any), and maintenance, repair and replacement requirements, all as specified in or contemplated by Solicitation for Offers 7MA2082, dated June 4, 2008, (hereinafter, the \"SFO\"), which is attached hereto and by this reference made a part hereof; (c) All construction in accordance with the SFO, including, without limitation, all provisions of the Architectural Finish Section of the SFO and Government Layout Drawings, Finish and Door Schedules, to be incorporated herein by reference upon completion; (d) All provisions and specifications of the Lesson's initial proposal dated June 25, 2008, and revised revised proposals; proposal dated August 22, 2008, as submitted in response to the SFO and the Government's request for (e) All services, including, without limitation, construction drawings and specifications, engineering and architectural services, and all permitting and approval requirements as are necessary to effect the construction and delivery of the Leased Premises in accordance with the requirements described herein; and by this Lease. (f) All rights, reservations of rights, privileges and the like as specified in, described by, or contemplated 7. IN REFERENCE TO BUILDOUT AND DELIVERY of the Leased Premises, the Lessor agrees to the following: (a) In no event shall the Leased Premises be deemed to be ready for occupancy unless the same shall 2 INITIALS RN CHRIS LESSOR GOVT. comply fully with all provisions of this Lease, including, but not limited to, the substantial completion of all improvements, requirements and construction in accordance with the specifications contained in this Lease, the SFO and the Government Layout Drawings and Finish Schedules, as referenced above and all documents referenced in the SFO and this Lease. (b) The phrase \"substantial completion\" (or \"substantially complete\") shall mean that all work necessary to deliver the Leased Premises in accordance with each and every requirement and specification of this Lease, and all other appurtenant things necessary for the Government's access to the Leased Premises and the full occupancy, possession, use and enjoyment thereof, shall have been completed or obtained, including, without limitation, all required reviews, approvals, consents and permits including a certificate of occupancy for the Leased Premises allowing occupancy for each of the uses described in and by this Lease, excepting only such minor matters as do not interfere with or diminish such access, occupancy, possession, use or enjoyment. In no event will the Leased Premises be deemed \"substantially complete\" or ready for occupancy unless the security system for the Leased Premises is fully operational, as determined by the Tenant Agency and Contracting Officer. (c) The Lessor hereby agrees that, as regards delivery of the Leased Premises to the Government ready for occupancy (hereinafter, \"Delivery\"): (i) Time is of the essence, (ii) Lessor shall effect Delivery of the Tenant Improvements in eighty-five (85) working days from the written \"Notice to Proceed, to be mutually agreed upon by the Government and the Lessor upon completion of the the \"Delivery Date\"). Construction Drawings, following delivery of the Government Layout Drawings and Finish Schedules (hereinafter (iii) Except with regard to such \"Punch List\" items as may be identified in the Acceptance Notice as defined in Paragraph 7 (c)(v) hereof, it is a condition precedent to Delivery that all construction required under this Lease shall be substantially complete and comply with the requirements of FAR 52.246.12 and 21 and GSAR 552.246-71 (hereinafter, the \"Regulations\"), and all drawings, plans and specifications referenced in the SFO and this Lease that the Leased Premises otherwise fully comply with the requirements of this Lease. (iv) As required under the Regulations, not less than ten (10) calendar days prior to the date on which the Leased Premises will, in the Lessor's reasonable, professional opinion, be ready for occupancy by the Government (the \"Proposed Readiness Date\"), the Lessor shall deliver to the Government written notice of said Proposed Readiness Date. Unless the Contracting Officer determines that the Leased Premises are not ready for inspection, not more than ten (10) calendar days following the Proposed Readiness Date, the Government shall commence inspection of all construction required under this Lease for compliance with the Regulations, the plans and all terms and conditions of this Lease (hereinafter, the \"Compliance Inspection\"). (v) It is a further condition precedent to Delivery hereunder that a satisfactory Compliance Inspection shall have been completed by the Government, and the Contracting Officer shall have delivered to the Lessor, written notice of the Government's acceptance of the Leased Premises as ready for occupancy (an \"Acceptance Notice\"), together with a Punch List or lists as contemplated in Paragraph 7(d) below, if applicable. (vi) Lessor's failure to deliver the entire Leased Premises substantially complete and ready for occupancy, as defined in this Paragraph 7, on the Delivery Date, shall be deemed to be an event of default pursuant to the Default in Delivery clause of this Lease, Paragraph 11 of GSA Form 3517, General Clauses of this Lease (the \"General\" Clauses\"), attached hereto and by this reference made a part hereof. (vii) Government acceptance of the Leased Premises pursuant to the Compliance Inspection is an acknowledgment of the completion of the work inspected, but is not acceptance of conditions which cannot be fairly discovered until after the Government takes full operational occupancy, an acceptance of latent defects, a waiver of on-going compliance with performance-based specifications, standards and requirements, or a certification of compliance with laws, regulations or other approvals or requirements, Lessor shall remain fully responsible for all of these, and shall correct any conditions at its sole cost and expense upon written notice from the Government. (viii) Government review of Lessor-prepared and submitted construction drawings and subsequent comments on same does not constitute a deviation from any provision, condition or requirement of this Lease unless specifically identified as such in writing by the Contracting Officer. (d) If the Government accepts the Leased Premises as ready for occupancy and the-Leased Premises are substantially complete but not fully complete, then the Government will provide to the Lessor after the Compliance Inspection a Punch List of items remaining to be completed (the \"Punch List Items\"). Lessor and the Government agree that in the event that the Punch List Items have not been completed within 60 days after the date the Government deems the Leased Premises ready for occupancy, and provided that the Lessor is not making reasonable efforts to complete said Punch List items, the Government shall have the right to withhold from 3 INITIALSEN SERES LESSOR GOVT. payments of rent due a sum of money equal to one and one-half times the estimated cost of completion of the outstanding Punch List Items. Upon completion of the Punch List Items, any sums retained by the Government shall be promptly paid to the Lessor. If Punch List Items are not fully completed within 30 days after the date the Government deems the Leased Premises ready for occupancy, the Government may exercise its rights under Paragraph 15 of the General Clauses of the Lease and may avail itself of any other remedy available to the Government at law or in equity; (e) Lessor shall promptly notify the Government Contracting Officer of any inconsistency among or between any of the documents referenced herein, and the Contracting Officer shall promptly determine which shall control. 8. LUMP SUM REIMBURSABLE ITEMS: With regard to the work required to be performed by the Lessor hereunder, the Lessor shall provide, install, and maintain any items identified as \"Lump Sum Reimbursable Items\" for the sums agreed upon. Provided that the Lessor shall have completed and delivered to the Government by the Delivery Date all such items of work and materials in full compliance with the requirements of this Lease, and further provided that the Lessor shall have provided to the Government an invoice for all work performed pursuant to this paragraph in accordance with all requirements of this Lease, the Government shall pay to the Lessor, as provided in Paragraphs 23, 24, and 25 of the General Clauses, full consideration for the completed work required with regard to such Lump Sum Reimbursable Items. 9. TENANT IMPROVEMENT ALLOWANCE: Referencing Paragraph 1.10 of the SFO, Lessor has included in the rental rate a Tenant Improvement (TI) Allowance in the amount of $488,716.75 ($44.53 per ANSI/BOMA Office Area square foot), amortized over five (5) years at the rate of 7.00 %. The Government may return to the Lessor any unused portion of the TI Allowance in exchange for a decrease in rent or a rent credit according to the amortization rate and the Lessor and the Government shall confirm said rental adjustment, if any, in writing by execution of a Supplemental Lease Agreement. 10. THE GOVERNMENT SHALL HAVE THE RIGHT but not the obligation, at its sole option and expense, to remove at any time during the term of this Lease any special equipment installed by the Government or by the Lessor for which Lessor was directly reimbursed by the Government as referenced above, unless such item is a fixture integral to the operation of the Building; in no event shall the following be considered fixtures integral to the operation of the Building: roof antenna(e) and/or dishes premises the Government shall remove all personal property from the Leased Premises. . Upon vacating the 11. CHANGE OF OWNERSHIP; If during the term of this Lease, including extensions, title to this property is transferred to another party by sale, foreclosure, condemnation, or other transaction, the Lessor (transferor) shall promptly notify the Contracting Officer of said transfer. The following information shall accompany notification: (a). Certified copy of the deed transferring title to the property from the lessor to the new owner; (b). Letter from the new owner assuming, approving, and agreeing to be bound by the terms of this Lease; effective date of transfer; (c). Letter from the Lessor waiving all rights under this Lease against the Government up to the (d). New owner's full legal name. If ownership is held in a Corporation, indicate State of incorporation; if a Partnership, list all partners; if a Limited Partnership or Limited Liability Corporation/Company, list all general partners or members and identify under which State the partnership or LLC was created; if a Trust, give names of all trustees and recording date of Trust. (e). New owner shall submit a completed GSA Form 3518, Representations and Certifications. (f). New owner shall submit a completed ACH Vendor Enrollment Form. All foregoing information must be received by the fifteenth day of the month in which the transfer of title will be effected. The rent for that month, adjusted in accordance with the effective date of transfer, will be processed to the transferor, and the initial rental payment to the transferee, will be processed on the first day of the second month following the transfer of title. If the notification of transfer and related information is not received until the sixteenth day of the month or later in which the transfer of title will be effected, the full contract rental for that month will be forwarded to the transferor. 4 INITIALS; LESSOR GOV'T. In this instance, it will be the responsibility of both the transferor and the transferee to submit in conjunction with other requested information, a letter of agreement regarding disposition of the monthly rent with respect to the effective date of transfer. In any instance, failure to submit documentation required for a transfer of title will result in a stop payment of rent until such time all documentation is received by the Contracting Officer 12. THE GOVERNMENT AT ITS OWN EXPENSE shall be responsible for providing and installing telecommunications, computer cable, conventional furniture, systems furniture and certain other special equipment prior to acceptance and occupancy of the Leased Premises. Outside contractors may be hired by the Government to. perform this work. The Lessor shall allow early access to the Leased Premises as needed to inspect, measure, deliver and install such furniture, components, infrastructure and/or equipment at no cost or expense to the Government or its contractors. Lessor shall provide advance construction scheduling which shall allow sufficient time for successful completion of the work or installation of furniture, components infrastructure and/or equipment. Lessor shall work closely with the Government and Government contractors to coordinate scheduling of such work or installation at the appropriate stage(s) of construction. In no event shall any such early entry or access be deemed to be an acceptance of the space or the work performed at that point, nor shall any such early entry or access be deemed to in any way to have accelerated the Commencement Date for any purpose. 13. TAX ADJUSTMENTS: Referencing Paragraphs 3.5 \"Tax Adjustment\" and 3.6 \"Percentage of Occupancy\" of the SFO, the percentage of Government occupancy of the Building for real estate tax purposes is agreed to be 10.00%. 14. OPERATING COSTS: Referencing Paragraph 3.7 \"Operating Costs\" and 3.8 \"Operating Cost Base\" of the SFO, the base rate for the cost of services (hereinafter, the \"Operating Costs Base\") shall be $94,647.00 subject to annual adjustment as provided therein, commencing on the first Anniversary Date of the Lease Commencement. 15. VACANT PREMISES: Referencing Paragraph 3.14 \"Adjustment for Vacant Premises\" of the SFO, provided that the Government's failure to occupy all or any portion of the Leased Premises does not result from an event of default or failure to perform on the part of Lessor which remains uncured beyond any cure period as may be provided in this Lease, if the Government fails to occupy all or any portion of the Leased Premises or vacates the Leased Premises in whole or in part prior to the expiration of this Lease, rent for such unoccupied portion of the Leased Premises shall be reduced by $1.55 per RSF plus or minus CPI escalations as applicable for the period of time during which the Leased Premises remains vacant. 16. OVERTIME USAGE: Referencing Paragraph 7.3 \"Overtime Usage\" of the SFO, the Government shall have no obligation for overtime usage of heating and air-conditioning. 17. CHANGE ORDERS: Unless explicitly authorized in advance and in writing by the Contracting Officer or a designated representative of the Contracting Officer (the \"Contracting Officer's Representative\"), additional supplies or services, or any change to the specifications, terms or conditions of this Lease (hereinafter a (hereinafter, a \"Change Order\"), shall be deemed to be an unauthorized Change in Lease Terms or unauthorized Change Order. The Government shall not pay all or any portion of the cost, charge or expense associated with any such unauthorized Change In Lease Terms or unauthorized Change Order. The Government's occupant tenant is not authorized to administer this Lease and the General Services Administration assumes no responsibility for any costs incurred by the Lessor except as provided herein. All questions and issues pertaining to this Lease shall be referred to the Contracting Officer or the Contracting Officer's Representative. 18. REPRESENTATIONS AND WARRANTIES OF LESSOR The Lessor hereby represents and warrants: (a). That it has the right to enter into and perform its obligations under this Lease and that it has taken all necessary action and procured all necessary consents and grants of authority pursuant to entering into this Lease (b). That no consent, approval or authorization of any person, including any governmental authority or other regulatory agency, is required in connection with the execution or performance of this Lease or the holding or use 5 INITIALS: _ LESSOR GOVT. of the Leased Premises by the Government. (c). That (i) it has, or will have prior to the Commencement Date, all permits, certificates, licenses, orders, registrations, authorizations and other approvals (collectively, the \"Permits\") from all federal, state and local governmental or regulatory agencies, bodies, authorities or other public or private entities which it is required to hold or which are required to be issued to it, or which are necessary or desirable for lease of the Premises to the Government for its contemplated uses; (ii) that such Permits constitute all of the Permits which it is required to hold or have received under the laws, rules and regulations applicable to it or its business; (iii) that it is in full compliance with all terms, provisions and conditions thereof; and (iv) that all of such Permits are in full force and effect and none will lapse or be terminated, suspended or otherwise adversely affected upon or by reason of the execution and delivery of this Lease. 19. SATELLITE DISH/ANTENNA: The Government reserves the right to install (a) microwave or satellite dish(es) or antenna(e) at or on the Leased Premises at any time during the term of this Lease, as the same may be extended or renewed. All rights and privileges of the Government to install, use and access satellite dish(es), antenna(e) and/or related equipment are considered to be requirements of this Lease and shall be at no additional rent, charges, fees or costs to the Government. 20. NOTICES: All notices and other communication which is required or permitted by this Lease shall be in writing and delivered by personal service, sent by registered or certified first class US mail, postage prepaid, properly addressed, or by regular overnight delivery service such as Federal Express ,, if intended for the Lessor to: SIS Center, Inc. 1441 Main Street Springfield, MA 01103 and if intended for the Government, to the below-named Contracting Officer at the following address: General Services Administration, Public Buildings Service 10 Causeway Street, Room 1075 Boston MA 02222 or to such other address as shall be given in writing by any party to the other. 21.RESTRICTION ON DISSEMINATION OF PLANS, DRAWINGS AND SPECIFICATIONS: Associated plans, drawings, or specifications provided under this Lease are intended for use by the Lessor, contractors, subcontractors and suppliers. In support of this requirement, GSA requires Lessor to exercise reasonable care when handling documents relating to building drawings/plans, security equipment, security equipment installations, and contract guard service, by the following means: (a) Limiting reproduction and/or dissemination of covered materials only to persons/parties related to this acquisition or otherwise authorized to receive such information; (b) information; Making every possible reasonable and prudent effort to prevent unauthorized disclosure of this (c) Keeping accurate and detailed records as to the identity of persons having access to or receiving copies of plans, drawings or specifications; Continuing the efforts required above throughout the entire term of this Lease and for what specific time thereafter as may be necessary; and (d) (e) When need for documents has elapsed, destroy all copies. 22. GOVERNING DOCUMENT: To the extent of any inconsistency between the terms of this SF-2 and any attachments, the terms of this SF-2 shall govern. 23. ATTACHMENTS: The following documents are attached hereto and by this reference made a part hereof: A. Exhibit \"A\", Tenth Floor Plan B. Exhibit \"B\", Garage Parking Plan indicating secure inside parking for 20 vehicles C. Solicitation for Offers 7MA2082 D. GSA Form 3517B, \"General Clauses\" E. GSA Form 3518, \"Representations and Certifications\" 6 INITIALS: LESSOR GOV'T. IN WITNESS WHEREOF, the parties hereto have hereunto subscribed their names as of the date first above written. LESSOR, SIS Center, Inc. Puich Neumon BY (Signature) CONTRACTING OFFICER (Official title) FEBRUARY 1965 EDITION 7 INITIALS: LESSOR GOVT."
        ,"formrecGeneralDoc" : {
            "keyValuePairs": [
                {
                  "key": {
                    "content": "INVOICE:",
                    "boundingRegions": [
                      {
                        "pageNumber": 1,
                        "boundingBox": [
                          1369,
                          281,
                          1485,
                          281,
                          1485,
                          307,
                          1369,
                          307
                        ]
                      }
                    ],
                    "spans": [
                      {
                        "offset": 42,
                        "length": 8
                      }
                    ]
                  },
                  "value": {
                    "content": "INV-100",
                    "boundingRegions": [
                      {
                        "pageNumber": 1,
                        "boundingBox": [
                          1490,
                          281,
                          1597,
                          281,
                          1597,
                          307,
                          1490,
                          307
                        ]
                      }
                    ],
                    "spans": [
                      {
                        "offset": 51,
                        "length": 7
                      }
                    ]
                  },
                  "confidence": 0.871
                },
                {
                    "key": {
                      "content": "INVOICE:",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1369,
                            281,
                            1485,
                            281,
                            1485,
                            307,
                            1369,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 42,
                          "length": 8
                        }
                      ]
                    },
                    "value": {
                      "content": "INV-100",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1490,
                            281,
                            1597,
                            281,
                            1597,
                            307,
                            1490,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 51,
                          "length": 7
                        }
                      ]
                    },
                    "confidence": 0.871
                  },
                  {
                    "key": {
                      "content": "INVOICE:",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1369,
                            281,
                            1485,
                            281,
                            1485,
                            307,
                            1369,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 42,
                          "length": 8
                        }
                      ]
                    },
                    "value": {
                      "content": "INV-100",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1490,
                            281,
                            1597,
                            281,
                            1597,
                            307,
                            1490,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 51,
                          "length": 7
                        }
                      ]
                    },
                    "confidence": 0.871
                  },
                  {
                    "key": {
                      "content": "INVOICE:",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1369,
                            281,
                            1485,
                            281,
                            1485,
                            307,
                            1369,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 42,
                          "length": 8
                        }
                      ]
                    },
                    "value": {
                      "content": "INV-100",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1490,
                            281,
                            1597,
                            281,
                            1597,
                            307,
                            1490,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 51,
                          "length": 7
                        }
                      ]
                    },
                    "confidence": 0.871
                  },
                  {
                    "key": {
                      "content": "INVOICE:",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1369,
                            281,
                            1485,
                            281,
                            1485,
                            307,
                            1369,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 42,
                          "length": 8
                        }
                      ]
                    },
                    "value": {
                      "content": "INV-100",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1490,
                            281,
                            1597,
                            281,
                            1597,
                            307,
                            1490,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 51,
                          "length": 7
                        }
                      ]
                    },
                    "confidence": 0.871
                  },
                  {
                    "key": {
                      "content": "INVOICE:",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1369,
                            281,
                            1485,
                            281,
                            1485,
                            307,
                            1369,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 42,
                          "length": 8
                        }
                      ]
                    },
                    "value": {
                      "content": "INV-100",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1490,
                            281,
                            1597,
                            281,
                            1597,
                            307,
                            1490,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 51,
                          "length": 7
                        }
                      ]
                    },
                    "confidence": 0.871
                  },
                  {
                    "key": {
                      "content": "INVOICE:",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1369,
                            281,
                            1485,
                            281,
                            1485,
                            307,
                            1369,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 42,
                          "length": 8
                        }
                      ]
                    },
                    "value": {
                      "content": "INV-100",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1490,
                            281,
                            1597,
                            281,
                            1597,
                            307,
                            1490,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 51,
                          "length": 7
                        }
                      ]
                    },
                    "confidence": 0.871
                  },
                  {
                    "key": {
                      "content": "INVOICE:",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1369,
                            281,
                            1485,
                            281,
                            1485,
                            307,
                            1369,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 42,
                          "length": 8
                        }
                      ]
                    },
                    "value": {
                      "content": "INV-100",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1490,
                            281,
                            1597,
                            281,
                            1597,
                            307,
                            1490,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 51,
                          "length": 7
                        }
                      ]
                    },
                    "confidence": 0.871
                  },
                  {
                    "key": {
                      "content": "INVOICE:",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1369,
                            281,
                            1485,
                            281,
                            1485,
                            307,
                            1369,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 42,
                          "length": 8
                        }
                      ]
                    },
                    "value": {
                      "content": "INV-100",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1490,
                            281,
                            1597,
                            281,
                            1597,
                            307,
                            1490,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 51,
                          "length": 7
                        }
                      ]
                    },
                    "confidence": 0.871
                  },
                  {
                    "key": {
                      "content": "INVOICE:",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1369,
                            281,
                            1485,
                            281,
                            1485,
                            307,
                            1369,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 42,
                          "length": 8
                        }
                      ]
                    },
                    "value": {
                      "content": "INV-100",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1490,
                            281,
                            1597,
                            281,
                            1597,
                            307,
                            1490,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 51,
                          "length": 7
                        }
                      ]
                    },
                    "confidence": 0.871
                  },
                  {
                    "key": {
                      "content": "INVOICE:",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1369,
                            281,
                            1485,
                            281,
                            1485,
                            307,
                            1369,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 42,
                          "length": 8
                        }
                      ]
                    },
                    "value": {
                      "content": "INV-100",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1490,
                            281,
                            1597,
                            281,
                            1597,
                            307,
                            1490,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 51,
                          "length": 7
                        }
                      ]
                    },
                    "confidence": 0.871
                  },
                  {
                    "key": {
                      "content": "INVOICE:",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1369,
                            281,
                            1485,
                            281,
                            1485,
                            307,
                            1369,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 42,
                          "length": 8
                        }
                      ]
                    },
                    "value": {
                      "content": "INV-100",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1490,
                            281,
                            1597,
                            281,
                            1597,
                            307,
                            1490,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 51,
                          "length": 7
                        }
                      ]
                    },
                    "confidence": 0.871
                  },
                  {
                    "key": {
                      "content": "INVOICE:",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1369,
                            281,
                            1485,
                            281,
                            1485,
                            307,
                            1369,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 42,
                          "length": 8
                        }
                      ]
                    },
                    "value": {
                      "content": "INV-100",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1490,
                            281,
                            1597,
                            281,
                            1597,
                            307,
                            1490,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 51,
                          "length": 7
                        }
                      ]
                    },
                    "confidence": 0.871
                  },
                  {
                    "key": {
                      "content": "INVOICE:",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1369,
                            281,
                            1485,
                            281,
                            1485,
                            307,
                            1369,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 42,
                          "length": 8
                        }
                      ]
                    },
                    "value": {
                      "content": "INV-100",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1490,
                            281,
                            1597,
                            281,
                            1597,
                            307,
                            1490,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 51,
                          "length": 7
                        }
                      ]
                    },
                    "confidence": 0.871
                  },
                  {
                    "key": {
                      "content": "INVOICE:",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1369,
                            281,
                            1485,
                            281,
                            1485,
                            307,
                            1369,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 42,
                          "length": 8
                        }
                      ]
                    },
                    "value": {
                      "content": "INV-100",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1490,
                            281,
                            1597,
                            281,
                            1597,
                            307,
                            1490,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 51,
                          "length": 7
                        }
                      ]
                    },
                    "confidence": 0.871
                  },
                  {
                    "key": {
                      "content": "INVOICE:",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1369,
                            281,
                            1485,
                            281,
                            1485,
                            307,
                            1369,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 42,
                          "length": 8
                        }
                      ]
                    },
                    "value": {
                      "content": "INV-100",
                      "boundingRegions": [
                        {
                          "pageNumber": 1,
                          "boundingBox": [
                            1490,
                            281,
                            1597,
                            281,
                            1597,
                            307,
                            1490,
                            307
                          ]
                        }
                      ],
                      "spans": [
                        {
                          "offset": 51,
                          "length": 7
                        }
                      ]
                    },
                    "confidence": 0.871
                  },
                {
                  "key": {
                    "content": "INVOICE DATE:",
                    "boundingRegions": [
                      {
                        "pageNumber": 1,
                        "boundingBox": [
                          1241,
                          320,
                          1437,
                          321,
                          1437,
                          349,
                          1241,
                          348
                        ]
                      }
                    ],
                    "spans": [
                      {
                        "offset": 72,
                        "length": 13
                      }
                    ]
                  },
                  "value": {
                    "content": "11/15/2019",
                    "boundingRegions": [
                      {
                        "pageNumber": 1,
                        "boundingBox": [
                          1443,
                          321,
                          1596,
                          321,
                          1597,
                          349,
                          1443,
                          349
                        ]
                      }
                    ],
                    "spans": [
                      {
                        "offset": 86,
                        "length": 10
                      }
                    ]
                  },
                  "confidence": 0.873
                }
            ],
            
            "entities": [
                {
                  "category": "Organization",
                  "subCategory": "Sports",
                  "content": "UM",
                  "boundingRegions": [
                    {
                      "pageNumber": 1,
                      "boundingBox": [
                        1007,
                        1081,
                        1039,
                        1081,
                        1039,
                        1106,
                        1007,
                        1106
                      ]
                    }
                  ],
                  "spans": [
                    {
                      "offset": 580,
                      "length": 2
                    }
                  ],
                  "confidence": 0.42
                },
                {
                  "category": "Quantity",
                  "subCategory": "Currency",
                  "content": "UM",
                  "boundingRegions": [
                    {
                      "pageNumber": 1,
                      "boundingBox": [
                        1007,
                        1081,
                        1039,
                        1081,
                        1039,
                        1106,
                        1007,
                        1106
                      ]
                    }
                  ],
                  "spans": [
                    {
                      "offset": 580,
                      "length": 2
                    }
                  ],
                  "confidence": 0.8
                },
                {
                  "category": "DateTime",
                  "subCategory": "Date",
                  "content": "3/4/2021",
                  "boundingRegions": [
                    {
                      "pageNumber": 1,
                      "boundingBox": [
                        115,
                        1134,
                        244,
                        1134,
                        244,
                        1168,
                        115,
                        1168
                      ]
                    }
                  ],
                  "spans": [
                    {
                      "offset": 600,
                      "length": 8
                    }
                  ],
                  "confidence": 0.8
                }
            ]
        }
    }    
]


export default function Content(props) {

    const [selectedMenuItem, setSelectedMenuItem] = useState("HOME");
    const [breadCrumbItems, setBreadCrumbItems] = useState([])
    const [documents, setDocuments] = useState(docs)

    useEffect(()=>{
        console.log("in useeffect")
        axios.get('/api/ner').then(response => {
            console.log(JSON.stringify(response.data))
            setDocuments(response.data)
        })
    },[])

    const onBreadcrumbHome = () => {
        setSelectedMenuItem("HOME")
        setBreadCrumbItems([])
    }

    const onSelectContent = (content) => {
        console.log(content.currentTarget.id)
        switch (content.currentTarget.id) {
            case 'CONFIGURE_PIPELINE':
                setSelectedMenuItem('CONFIGURE_PIPELINE')
                breadCrumbItems.push({ text: 'Home', key: 'home', onClick: onBreadcrumbHome })
                breadCrumbItems.push({ text: 'Configure Pipeline', key: 'CONFIGURE_PIPELINE' })
                setBreadCrumbItems(breadCrumbItems)
                break
            case 'CURRENT_PIPELINE':
                setSelectedMenuItem('CURRENT_PIPELINE')
                breadCrumbItems.push({ text: 'Home', key: 'home', onClick: onBreadcrumbHome })
                breadCrumbItems.push({ text: 'View Pipeline', key: 'CURRENT_PIPELINE' })
                setBreadCrumbItems(breadCrumbItems)
                break
            case 'UPLOAD_DOCUMENTS':
                setSelectedMenuItem('UPLOAD_DOCUMENTS')
                breadCrumbItems.push({ text: 'Home', key: 'home', onClick: onBreadcrumbHome })
                breadCrumbItems.push({ text: 'Upload Documents', key: 'UPLOAD_DOCUMENTS' })
                setBreadCrumbItems(breadCrumbItems)
                break
            case 'VIEW_INSIGHTS':
                setSelectedMenuItem('VIEW_INSIGHTS')
                breadCrumbItems.push({ text: 'Home', key: 'home', onClick: onBreadcrumbHome })
                breadCrumbItems.push({ text: 'View Insights', key: 'VIEW_INSIGHTS' })
                setBreadCrumbItems(breadCrumbItems)
            default:
                break;
        }
    }

    const renderContent = () => {
        switch (selectedMenuItem) {
            case 'HOME':
                return (<Home onClick={onSelectContent} theme={props.theme} />)
            case 'CURRENT_PIPELINE':
                return (<CurrentPipeline theme={props.theme} />)
            case 'CONFIGURE_PIPELINE':
                return (<Stages theme={props.theme} onSelectContent={onSelectContent} />)
            case 'UPLOAD_DOCUMENTS':
                return (<Upload theme={props.theme} />)
            case 'VIEW_INSIGHTS':
                return (<ViewInsights theme={props.theme} documents={documents} onSelectContent={onSelectContent} />)

            default:
                return (<Home />)
        }
    }

    const renderBreadcrumb = () => {
        switch (selectedMenuItem) {
            case 'HOME':
                return (
                    <Breadcrumb >
                        <Breadcrumb.Item style={{ paddingLeft: "0px" }}>
                            Home
                        </Breadcrumb.Item>
                    </Breadcrumb>)
            case 'CURRENT_PIPELINE':
                return (
                    <>
                        <Breadcrumb >
                            <Breadcrumb.Item style={{ paddingLeft: "0px" }}>
                                <Breadcrumb.Link href="" onClick={onBreadcrumbHome}>Home</Breadcrumb.Link>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <Breadcrumb.Divider>
                            <ChevronEndMediumIcon />
                        </Breadcrumb.Divider>
                        <Breadcrumb.Item>
                            Create Pipeline
                        </Breadcrumb.Item>
                    </>)
            case 'CONFIGURE_PIPELINE':
                return (
                    <>
                        <Breadcrumb >
                            <Breadcrumb.Item style={{ paddingLeft: "0px" }}>
                                <Breadcrumb.Link href="" onClick={onBreadcrumbHome}>Home</Breadcrumb.Link>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <Breadcrumb.Divider>
                            <ChevronEndMediumIcon />
                        </Breadcrumb.Divider>
                        <Breadcrumb.Item>
                            View Pipeline
                        </Breadcrumb.Item>
                    </>)
            case 'UPLOAD_DOCUMENTS':
                return (<>
                    <Breadcrumb >
                        <Breadcrumb.Item style={{ paddingLeft: "0px" }}>
                            <Breadcrumb.Link href="" onClick={onBreadcrumbHome}>Home</Breadcrumb.Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Breadcrumb.Divider>
                        <ChevronEndMediumIcon />
                    </Breadcrumb.Divider>
                    <Breadcrumb.Item>
                        Ingest Documents
                    </Breadcrumb.Item>
                </>)

            case 'VIEW_INSIGHTS':
                return (<>
                    <Breadcrumb >
                        <Breadcrumb.Item style={{ paddingLeft: "0px" }}>
                            <Breadcrumb.Link href="" onClick={onBreadcrumbHome}>Home</Breadcrumb.Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Breadcrumb.Divider>
                        <ChevronEndMediumIcon />
                    </Breadcrumb.Divider>
                    <Breadcrumb.Item>
                        View Insights
                    </Breadcrumb.Item>
                </>)

            default:
                return (<Home />)
        }
    }

    return (
        <div className="content" >
            <div style={{ paddingLeft: "0px", paddingTop: "50px", maxWidth: "1000px", minWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}>
                {renderBreadcrumb()}
                {renderContent()}
            </div>
        </div>
    )

}